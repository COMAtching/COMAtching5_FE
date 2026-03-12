/**
 * HEIC 파일을 JPG로 변환합니다.
 * HEIC 파일이 아니면 원본 파일을 그대로 반환합니다.
 */
export const convertHeicToJpg = async (file: File): Promise<File> => {
  const isHeicOrHeif =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (isHeicOrHeif && typeof window !== "undefined") {
    try {
      // heic2any는 서버 사이드에서 실행될 수 없으므로 다이내믹 임포트 처리
      const { default: heic2any } = await import("heic2any");

      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      const blob = Array.isArray(convertedBlob)
        ? convertedBlob[0]
        : convertedBlob;

      return new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
        type: "image/jpeg",
      });
    } catch (error) {
      console.error("HEIC conversion failed:", error);
      throw error;
    }
  }

  return file;
};
