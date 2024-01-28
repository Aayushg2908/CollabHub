import { getTodoRoomById, joinTodoRoom } from "@/actions/todo";
import { Room } from "./_components/Room";

const TodoRoomIdPage = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params;
  await joinTodoRoom(roomId);

  const todoRoom = await getTodoRoomById(roomId);

  return (
    <div className="w-full h-full">
      <Room room={todoRoom} />
    </div>
  );
};

export default TodoRoomIdPage;
