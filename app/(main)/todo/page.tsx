import { CreateTodoRoom } from "./_components/CreateTodoRoom";
import RoomPage from "@/components/RoomPage";
import { getAllRooms, getOwnedRooms } from "@/actions";

const TodoPage = async () => {
  const ownedRooms = await getOwnedRooms("TODO");
  const allRooms = await getAllRooms("TODO");

  return (
    <RoomPage ownedRooms={ownedRooms} allRooms={allRooms} link="TODO">
      <CreateTodoRoom />
    </RoomPage>
  );
};

export default TodoPage;
