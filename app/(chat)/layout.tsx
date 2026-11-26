import { ChatViewerProvider } from "@/hooks/useChatViewer";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatViewerProvider>{children}</ChatViewerProvider>;
}
