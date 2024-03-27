import { Room } from "./_components/Room";
import { joinRoom } from "@/actions";

const TodoRoomIdPage = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params;
  await joinRoom(roomId, "TODO");

  return (
    <div className="w-full h-full">
      <Room roomId={roomId} />
    </div>
  );
};

export default TodoRoomIdPage;
