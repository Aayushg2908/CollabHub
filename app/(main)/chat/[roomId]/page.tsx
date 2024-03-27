import { Room } from "./_components/Room";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { joinRoom } from "@/actions";

const ChatByIdPage = async ({ params }: { params: { roomId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const { roomId } = params;
  await joinRoom(roomId, "CHAT");

  return (
    <div className="w-full h-full">
      <Room roomId={roomId} userId={userId} />
    </div>
  );
};

export default ChatByIdPage;
