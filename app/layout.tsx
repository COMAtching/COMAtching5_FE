import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: {
    default: "코매칭",
    template: "%s | 코매칭",
  },
  description: "대학교 축제에서 운명의 인연을 만나보세요!",
  keywords: ["대학축제", "커플매칭", "소개팅", "만남", "대학생", "축제"],
  openGraph: {
    title: "코매칭 - 대학축제 커플매칭",
    description: "대학교 축제에서 운명의 인연을 만나보세요!",
    type: "website",
    locale: "ko_KR",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body
        className={`${pretendard.className} flex justify-center bg-white antialiased md:bg-gray-100`}
      >
        <div className="min-h-dvh w-full overflow-x-hidden bg-white px-4 text-black md:max-w-[430px] md:shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
