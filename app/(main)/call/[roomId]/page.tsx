import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Room from "./_components/Room";
import { joinRoom } from "@/actions";

const CallByIdPage = async ({ params }: { params: { roomId: string } }) => {
  const user = await currentUser();
  if (!user || !user.id) {
    return redirect("/sign-in");
  }

  const { roomId } = params;
  await joinRoom(roomId, "CALL");

  return <Room roomId={roomId} username={user.username!} />;
};

export default CallByIdPage;
