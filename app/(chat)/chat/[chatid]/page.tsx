import ScreenChatRoom from "./_components/ScreenChatRoom";

type ChatRoomPageProps = {
  params: Promise<{
    chatid: string;
  }>;
};

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { chatid } = await params;
  return <ScreenChatRoom chatId={chatid} />;
}
