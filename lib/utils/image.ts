import heic2any from "heic2any";

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

  if (isHeicOrHeif) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8,
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
