import Image from "next/image";
import { getProfileImageUrl } from "@/lib/utils/profile";

export default function ProfileThumbnail({
  url,
  gender,
  alt,
}: {
  url?: string | null;
  gender?: string;
  alt: string;
}) {
  return (
    <Image
      src={getProfileImageUrl(url, gender)}
      alt={alt}
      fill
      sizes="48px"
      className="object-cover"
    />
  );
}
