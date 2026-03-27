import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// token.json 읽기
const tokensPath = path.join(__dirname, "../app/token.json");
const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));

// 키 정제 함수 - 더 엄격하게
function sanitizeKey(key) {
  return key
    .replace(/\(.*?\)/g, "") // 괄호와 내용 제거
    .replace(/[^\w-]/g, "-") // 특수문자를 하이픈으로
    .replace(/^-+|-+$/g, "") // 앞뒤 하이픈 제거
    .replace(/-+/g, "-") // 연속 하이픈을 하나로
    .toLowerCase();
}

// 유효한 CSS 변수명인지 확인
function isValidCSSVarName(name) {
  // 숫자로만 구성되거나, 숫자로 시작하면 안됨
  return !/^\d+$/.test(name) && !/^-?\d/.test(name) && name.length > 0;
}

// 유효한 CSS 값인지 확인
function isValidCSSValue(value) {
  if (typeof value === "number") return true;
  if (typeof value === "string" && value.trim().length > 0) {
    // [object Object] 같은 잘못된 값 제외
    if (value.includes("[object")) return false;
    // roundTo, 수식 같은 함수 호출 제외
    if (value.includes("roundTo(") || /\*|\^/.test(value)) return false;
    // 참조는 나중에 해석되므로 허용
    return true;
  }
  return false;
}

// 해석된 CSS 값이 유효한지 확인 (최종 검증)
function isValidResolvedValue(value) {
  if (typeof value === "number") return true;
  if (typeof value === "string" && value.trim().length > 0) {
    // 해석되지 않은 참조가 남아있으면 제외
    if (value.includes("{") && value.includes("}")) return false;
    // var(...) 참조는 유효
    if (value.startsWith("var(--")) return true;
    // 일반 CSS 값 (색상, px 등)
    return true;
  }
  return false;
}

// 토큰 저장소 (중복 방지를 위해 Map 사용)
const tokenMap = new Map(); // key -> { type, value, path }

// 재귀적으로 token.json 탐색
function traverseTokens(obj, path = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      // $type과 $value가 있으면 토큰임
      if (value.$type && value.$value !== undefined) {
        const tokenName = sanitizeKey(key);

        // 유효성 검사
        if (!isValidCSSVarName(tokenName)) continue;
        if (!isValidCSSValue(value.$value)) continue;

        // 경로를 포함한 고유 키 생성 (중복 방지)
        const fullPath = [...path, key].map(sanitizeKey).join("-");
        const uniqueKey = fullPath || tokenName;

        // 이미 존재하지 않으면 추가
        if (!tokenMap.has(uniqueKey)) {
          tokenMap.set(uniqueKey, {
            name: tokenName,
            type: value.$type,
            value: value.$value,
            path: [...path, key],
            fullPath: uniqueKey,
          });
        }
      } else {
        // 재귀적으로 탐색
        traverseTokens(value, [...path, key]);
      }
    }
  }
}

// 토큰 참조 해석 (범용)
function resolveValue(value, depth = 0) {
  if (depth > 10 || typeof value !== "string") return value;

  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;

  const ref = match[1];
  const parts = ref.split(".");
  const lastPart = parts[parts.length - 1];
  const tokenName = sanitizeKey(lastPart);

  // tokenMap에서 찾기
  for (const [key, token] of tokenMap.entries()) {
    if (token.name === tokenName) {
      return `var(--${token.name})`;
    }
  }

  // 못 찾으면 그대로 반환
  return value;
}

// 1단계: 모든 토큰 수집
traverseTokens(tokens);
const allTokens = Array.from(tokenMap.values());

console.log(`\n🔍 Collected ${allTokens.length} unique tokens`);

// 2단계: CSS 변수 생성 (중복 제거 및 정렬)
const uniqueVars = new Map();

allTokens.forEach((token) => {
  let cssValue = token.value;

  // 참조 해석
  if (typeof cssValue === "string" && cssValue.includes("{")) {
    cssValue = resolveValue(cssValue);
  }

  // 타입에 따라 단위 추가
  if (token.type === "dimension" && typeof cssValue === "number") {
    cssValue = `${cssValue}px`;
  } else if (token.type === "spacing" && typeof cssValue === "number") {
    cssValue = `${cssValue}px`;
  }

  // 최종 해석된 값이 유효한지 확인
  if (!isValidResolvedValue(cssValue)) {
    return; // 유효하지 않으면 건너뛰기
  }

  // 중복 방지: 같은 이름이 있으면 더 구체적인 경로를 우선
  if (!uniqueVars.has(token.name)) {
    uniqueVars.set(token.name, cssValue);
  }
});

const cssVariables = Array.from(uniqueVars.entries())
  .map(([name, value]) => `  --${name}: ${value};`)
  .sort(); // 알파벳 순 정렬

// 3단계: Tailwind 유틸리티 클래스 생성
const colorTokens = allTokens.filter((t) => t.type === "color");
const fontTokens = allTokens.filter((t) => t.name.startsWith("font-size-"));

// 배경색 유틸리티 (중복 제거)
const bgUtilitiesSet = new Set();
colorTokens
  .filter((t) => t.name.includes("color-") || t.name.includes("background-"))
  .forEach((t) => {
    bgUtilitiesSet.add(
      `  .bg-${t.name} { background-color: var(--${t.name}); }`,
    );
  });
const bgUtilities = Array.from(bgUtilitiesSet).sort().join("\n");

// 텍스트 색상 유틸리티 (중복 제거)
const textColorUtilitiesSet = new Set();
colorTokens
  .filter((t) => t.name.includes("color-") || t.name.includes("text-"))
  .forEach((t) => {
    textColorUtilitiesSet.add(`  .text-${t.name} { color: var(--${t.name}); }`);
  });
const textColorUtilities = Array.from(textColorUtilitiesSet).sort().join("\n");

// 폰트 사이즈 유틸리티 (typo-{size}-{weight})
const weights = ["400", "500", "600", "700"];
const fontUtilitiesSet = new Set();

// token.json에서 가져온 폰트 사이즈
fontTokens.forEach((t) => {
  const size = t.value;
  if (typeof size === "number") {
    weights.forEach((weight) => {
      fontUtilitiesSet.add(`  .typo-${size}-${weight} {
    font-size: ${size}px;
    font-weight: ${weight};
  }`);
    });
  }
});

// 추가 폰트 사이즈 (10~30까지 모든 사이즈)
const additionalSizes = [
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  29, 30,
];
additionalSizes.forEach((size) => {
  weights.forEach((weight) => {
    fontUtilitiesSet.add(`  .typo-${size}-${weight} {
    font-size: ${size}px;
    font-weight: ${weight};
  }`);
  });
});

const fontUtilities = Array.from(fontUtilitiesSet).sort((a, b) => {
  const sizeA = parseInt(a.match(/typo-(\d+)-/)?.[1] || 0);
  const sizeB = parseInt(b.match(/typo-(\d+)-/)?.[1] || 0);
  if (sizeA !== sizeB) return sizeA - sizeB;
  return a.localeCompare(b);
});

// Border 유틸리티 (중복 제거)
const borderUtilitiesSet = new Set();
colorTokens
  .filter((t) => t.name.includes("color-") || t.name.includes("border-"))
  .forEach((t) => {
    borderUtilitiesSet.add(
      `  .border-${t.name} { border-color: var(--${t.name}); }`,
    );
  });
const borderUtilities = Array.from(borderUtilitiesSet).sort().join("\n");

// 4단계: CSS 파일 생성
const cssContent = `/* Auto-generated from token.json */
/* Run: pnpm run token to regenerate */
/* Total unique tokens: ${uniqueVars.size} */

@layer base {
  :root {
${cssVariables.join("\n")}
  }
}

@layer utilities {
  /* Font utilities */
${fontUtilities.join("\n\n")}

  /* Background color utilities */
${bgUtilities}

  /* Text color utilities */
${textColorUtilities}

  /* Border utilities */
${borderUtilities}

  /* Custom gradient buttons */
  .bg-button-primary {
    background: linear-gradient(135deg, var(--color-brand-primary-flame), var(--color-brand-primary-orange));
  }
}
`;

// tokens.css 파일로 저장
const outputPath = path.join(__dirname, "../app/tokens.css");
fs.writeFileSync(outputPath, cssContent, "utf-8");

console.log("✅ Tokens generated successfully!");
console.log(`📝 Output: ${outputPath}`);
console.log(`📊 Total unique tokens: ${uniqueVars.size}`);
console.log(
  `   - Colors: ${colorTokens.length}, Fonts: ${fontTokens.length}, Others: ${
    allTokens.length - colorTokens.length - fontTokens.length
  }`,
);
console.log("\n✨ Improvements:");
console.log("   - Removed duplicate variable names");
console.log("   - Filtered out invalid CSS values ([object Object])");
console.log(
  "   - Fixed variable names (removed parentheses, numbers-only names)",
);
console.log("   - Sorted variables alphabetically");
console.log("\nNext steps:");
console.log("1. Import tokens.css in your globals.css:");
console.log('   @import "./tokens.css";');
console.log("\n2. Use utilities in your components:");
console.log(
  '   <div className="bg-background-app-base text-16-500">Hello</div>',
);
