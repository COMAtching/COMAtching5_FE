import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// token.json 읽기
const tokensPath = path.join(__dirname, "../app/token.json");
const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));

// Semantic tokens에서 실제 색상값 추출
const semanticMode1 = tokens["Sementic/Mode 1"] || {};
const systemMode1 = tokens["System/Mode 1"] || {};

// Grayscale, Colors, Transparent 값 추출
const grayscale = semanticMode1.Grayscale || {};
const colors = semanticMode1.Colors || {};
const transparent = semanticMode1.Transparent || {};

// CSS 변수 생성
let cssVariables = [];

// 키 정제 함수 (공백을 하이픈으로 변경)
function sanitizeKey(key) {
  return key.replace(/\s+/g, "-").toLowerCase();
}

// Grayscale 색상
Object.entries(grayscale).forEach(([key, value]) => {
  if (key.startsWith("color-gray-")) {
    cssVariables.push(`  --${sanitizeKey(key)}: ${value.$value};`);
  }
});

// Colors (Pink, Flame, Orange)
if (colors.Pink) {
  Object.entries(colors.Pink).forEach(([key, value]) => {
    if (key.startsWith("color-pink-")) {
      cssVariables.push(`  --${sanitizeKey(key)}: ${value.$value};`);
    }
  });
}
if (colors.Flame) {
  Object.entries(colors.Flame).forEach(([key, value]) => {
    if (key.startsWith("color-flame-")) {
      cssVariables.push(`  --${sanitizeKey(key)}: ${value.$value};`);
    }
  });
}
if (colors.Orange) {
  Object.entries(colors.Orange).forEach(([key, value]) => {
    if (key.startsWith("color-orange-")) {
      cssVariables.push(`  --${sanitizeKey(key)}: ${value.$value};`);
    }
  });
}

// Transparent
Object.entries(transparent).forEach(([key, value]) => {
  cssVariables.push(`  --${sanitizeKey(key)}: ${value.$value};`);
});

// System tokens
if (systemMode1.Colors) {
  Object.entries(systemMode1.Colors).forEach(([key, value]) => {
    if (value.$type === "color") {
      const finalValue = resolveValue(value.$value);
      cssVariables.push(`  --${sanitizeKey(key)}: ${finalValue};`);
    }
  });
}

// Radius
if (systemMode1.Radius) {
  Object.entries(systemMode1.Radius).forEach(([key, value]) => {
    const varName = key.replace("radius-", "");
    cssVariables.push(`  --radius-${sanitizeKey(varName)}: ${value.$value}px;`);
  });
}

// Border
if (systemMode1.Border) {
  Object.entries(systemMode1.Border).forEach(([key, value]) => {
    const varName = key.replace("border-width-", "");
    cssVariables.push(`  --border-${sanitizeKey(varName)}: ${value.$value}px;`);
  });
}

// Opacity
if (systemMode1.Opacity) {
  Object.entries(systemMode1.Opacity).forEach(([key, value]) => {
    const varName = key.replace("opacity-", "");
    cssVariables.push(`  --opacity-${sanitizeKey(varName)}: ${value.$value}%;`);
  });
}

// 토큰 참조 해석
function resolveValue(value, depth = 0) {
  if (depth > 10 || typeof value !== "string") return value;

  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;

  const ref = match[1];

  // Grayscale 참조
  if (ref.startsWith("Grayscale.")) {
    const key = ref.replace("Grayscale.", "");
    return `var(--${key})`;
  }

  // Colors 참조
  if (ref.startsWith("Colors.Pink.")) {
    const key = ref.replace("Colors.Pink.", "");
    return `var(--${key})`;
  }
  if (ref.startsWith("Colors.Flame.")) {
    const key = ref.replace("Colors.Flame.", "");
    return `var(--${key})`;
  }
  if (ref.startsWith("Colors.Orange.")) {
    const key = ref.replace("Colors.Orange.", "");
    return `var(--${key})`;
  }

  // Transparent 참조
  if (ref.startsWith("Transparent.")) {
    const key = ref.replace("Transparent.", "");
    return `var(--${key})`;
  }

  // System/Mode 1의 Colors 참조
  if (ref.startsWith("Colors.")) {
    const key = ref.replace("Colors.", "");
    return `var(--${key})`;
  }

  return value;
}

// Font Size - text-{size}-{weight} 형태로 생성
const fontSizes = systemMode1?.Font || {};
const weights = ["400", "500", "600", "700"];
let tailwindUtilities = [];

Object.entries(fontSizes).forEach(([key, value]) => {
  if (key.startsWith("font-size-")) {
    const size = value.$value;
    weights.forEach((weight) => {
      const className = `.text-${size}-${weight}`;
      tailwindUtilities.push(`${className} {
  font-size: ${size}px;
  font-weight: ${weight};
  line-height: 1.5;
}`);
    });
  }
});

// CSS 파일 생성
const cssContent = `/* Auto-generated from token.json */
/* Run: node scripts/generate-tokens.js to regenerate */

@layer base {
  :root {
${cssVariables.join("\n")}
  }
}

@layer utilities {
  /* Text utilities: text-{size}-{weight} */
${tailwindUtilities.join("\n\n")}

  /* Background utilities */
  .bg-surface-base { background-color: var(--color-surface-base); }
  .bg-brand-secondary-pink { background-color: var(--color-brand-secondary-pink); }
  .bg-brand-primary-orange { background-color: var(--color-brand-primary-orange); }
  .bg-disabled { background-color: var(--color-background-disabled); }
  
  /* Button utilities */
  .bg-button-primary {
    background: linear-gradient(135deg, var(--color-brand-primary-flame), var(--color-brand-primary-orange));
  }
  
  .bg-button-disabled {
    background-color: var(--color-background-disabled);
  }
  
  .bg-button-slate {
    background-color: var(--color-gray-0-a30);
  }
  
  /* Border utilities */
  .border-light { border-color: var(--color-border-light); }
  
  /* Text color utilities */
  .text-white { color: var(--color-text-white); }
  .text-disabled { color: var(--color-text-disabled); }
  .text-brand-black { color: var(--color-brand-black); }
}
`;

// tokens.css 파일로 저장
const outputPath = path.join(__dirname, "../app/tokens.css");
fs.writeFileSync(outputPath, cssContent, "utf-8");

console.log("✅ Tokens generated successfully!");
console.log(`📝 Output: ${outputPath}`);
console.log("\nNext steps:");
console.log("1. Import tokens.css in your globals.css:");
console.log('   @import "./tokens.css";');
console.log("\n2. Use utilities in your components:");
console.log('   <div className="bg-surface-base text-16-500">Hello</div>');
