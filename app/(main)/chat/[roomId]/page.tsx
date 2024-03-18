import { joinChatRoom } from "@/actions/chat";
import { Room } from "./_components/Room";

const ChatByIdPage = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params;
  await joinChatRoom(roomId);

  return (
    <div className="w-full h-full">
      <Room roomId={roomId} />
    </div>
  );
};

export default ChatByIdPage;
