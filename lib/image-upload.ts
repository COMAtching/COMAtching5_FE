import { api } from "@/lib/axios";
import { convertHeicToJpg } from "@/lib/utils/image";

export const IMAGE_MIB = { profile: 10, chat: 20 } as const;
type ImagePurpose = keyof typeof IMAGE_MIB;
export const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.gif,.heic,.heif";

type UploadForm = {
  uploadUrl: string;
  fields: Record<string, string>;
  imageKey: string;
  maxBytes: number;
};

function checkSize(
  file: File,
  purpose: ImagePurpose,
  maxBytes = IMAGE_MIB[purpose] * 1024 * 1024,
) {
  if (file.size === 0 || file.size > maxBytes) {
    throw new Error(
      `이미지는 1바이트 이상 ${IMAGE_MIB[purpose]} MiB 이하로 선택해주세요.`,
    );
  }
}

export async function prepareImage(file: File, purpose: ImagePurpose) {
  checkSize(file, purpose);
  const result = await convertHeicToJpg(file);
  checkSize(result, purpose);
  if (
    !/\.(?:jpg|jpeg|png|gif)$/i.test(result.name) ||
    (result.type && !result.type.startsWith("image/"))
  ) {
    throw new Error("JPG, PNG 또는 GIF 이미지를 선택해주세요.");
  }
  return result;
}

export async function uploadProfileImage(file: File): Promise<string> {
  checkSize(file, "profile");
  const response = await api.get<{ data: UploadForm }>(
    "/api/members/files/presigned/profiles",
    {
      params: { filename: file.name },
    },
  );
  return postImage(file, "profile", response.data.data);
}

export async function uploadChatImage(
  file: File,
  roomId: string,
  signal: AbortSignal,
): Promise<string> {
  const image = await prepareImage(file, "chat");
  const response = await api.post<{ data: UploadForm }>(
    `/api/chat/rooms/${encodeURIComponent(roomId)}/files/presigned-url`,
    { filename: image.name },
    { signal },
  );
  return postImage(image, "chat", response.data.data, signal);
}

async function postImage(
  file: File,
  purpose: ImagePurpose,
  form: UploadForm,
  signal?: AbortSignal,
): Promise<string> {
  checkSize(file, purpose, form.maxBytes);
  const body = new FormData();
  for (const [name, value] of Object.entries(form.fields))
    body.append(name, value);
  // S3 parses the policy fields before the final file part. Let the browser generate its boundary.
  body.append("file", file);
  const result = await fetch(form.uploadUrl, {
    method: "POST",
    body,
    credentials: "omit",
    signal,
  });
  if (!result.ok)
    throw new Error("이미지를 업로드하지 못했습니다. 새로 선택해 주세요.");
  return form.imageKey;
}
