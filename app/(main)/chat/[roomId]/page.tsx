import { joinChatRoom } from "@/actions/chat";
import { Room } from "./_components/Room";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ChatByIdPage = async ({ params }: { params: { roomId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const { roomId } = params;
  await joinChatRoom(roomId);

  return (
    <div className="w-full h-full">
      <Room roomId={roomId} userId={userId} />
    </div>
  );
};

export default ChatByIdPage;
