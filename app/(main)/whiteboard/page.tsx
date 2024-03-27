import { CreateWhiteboardRoom } from "./_components/CreateWhiteboardRoom";
import RoomPage from "@/components/RoomPage";
import { getAllRooms, getOwnedRooms } from "@/actions";

const WhiteboardPage = async () => {
  const ownedRooms = await getOwnedRooms("WHITEBOARD");
  const allRooms = await getAllRooms("WHITEBOARD");

  return (
    <RoomPage ownedRooms={ownedRooms} allRooms={allRooms} link="WHITEBOARD">
      <CreateWhiteboardRoom />
    </RoomPage>
  );
};

export default WhiteboardPage;
