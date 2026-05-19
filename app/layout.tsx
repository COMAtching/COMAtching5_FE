import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Blur from "@/components/common/Blur";
import { QueryProvider } from "@/providers/query-provider";
// import { ServiceStatusProvider } from "@/providers/service-status-provider";
// import { getInitialMaintenanceStatus } from "@/lib/status";
import FcmInitializer from "@/components/common/FcmInitializer";
import PwaInitializer from "@/components/common/PwaInitializer";
import ChatSocketInitializer from "@/components/common/ChatSocketInitializer";
import ToastContainer from "@/components/common/ToastContainer";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://comatching.site"),
  title: {
    default: "코매칭",
    template: "%s | 코매칭",
  },
  description: "대학교 축제에서 운명의 인연을 만나보세요!",
  keywords: ["대학축제", "커플매칭", "소개팅", "만남", "대학생", "축제"],
  icons: {
    icon: [
      { url: "/logo/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/logo/icon.png",
    apple: [{ url: "/logo/icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "코매칭",
  },
  openGraph: {
    title: "코매칭 - 대학축제 커플매칭",
    description: "대학교 축제에서 운명의 인연을 만나보세요!",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "코매칭 - 대학축제 커플매칭",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "코매칭 - 대학축제 커플매칭",
    description: "대학교 축제에서 운명의 인연을 만나보세요!",
    images: ["/og-image.png"],
  },
  other: {
    // TODO: 네이버 서치어드바이저 등록 시 발급받는 HTML 메타 태그의 content 값을 여기에 적으시면 연동됩니다.
    "naver-site-verification": "7b6e08b25a57e167f4e15e021ca296b726efc6df",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fff",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const initialMaintenanceMode = await getInitialMaintenanceStatus();

  return (
    <html lang="ko" className={pretendard.variable}>
      <body
        className={`${pretendard.className} flex justify-center bg-white antialiased`}
      >
        <QueryProvider>
          {/* <ServiceStatusProvider
            initialMaintenanceMode={initialMaintenanceMode}
          > */}
          <div className="bg-background-app-base relative isolate min-h-dvh w-full overflow-x-hidden text-black md:max-w-[430px] md:shadow-lg">
            <Blur />
            <FcmInitializer />
            <PwaInitializer />
            <ChatSocketInitializer />
            <ToastContainer />
            {children}
          </div>
          {/* </ServiceStatusProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}
