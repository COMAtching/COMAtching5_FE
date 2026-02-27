const CHO_SUNG = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const HANGUL_START = 0xac00;

/**
 * 주어진 검색어(초성 포함)를 바탕으로 정규식을 생성합니다.
 * 예: "가ㄱ" -> /가[ㄱ가-깋]/i
 */
export function createChoseongRegex(searchWord: string): RegExp {
  const regexString = searchWord
    .split("")
    .map((char) => {
      const choIndex = CHO_SUNG.indexOf(char);
      if (choIndex !== -1) {
        const startChar = String.fromCharCode(HANGUL_START + choIndex * 588);
        const endChar = String.fromCharCode(
          HANGUL_START + (choIndex + 1) * 588 - 1,
        );
        return `[${char}${startChar}-${endChar}]`;
      }
      return char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("");
  return new RegExp(regexString, "i");
}
