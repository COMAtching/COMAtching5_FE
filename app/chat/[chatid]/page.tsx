import ScreenChatRoom from "./_components/ScreenChatRoom";

type ChatRoomPageProps = {
  params: {
    chatid: string;
  };
};

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  return <ScreenChatRoom chatId={params.chatid} />;
}
