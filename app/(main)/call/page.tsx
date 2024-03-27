import { getAllRooms, getOwnedRooms } from "@/actions";
import { CreateCallRoom } from "./_components/CreateCallRoom";
import RoomPage from "@/components/RoomPage";

const CallPage = async () => {
  const ownedRooms = await getOwnedRooms("CALL");
  const allRooms = await getAllRooms("CALL");

  return (
    <RoomPage ownedRooms={ownedRooms} allRooms={allRooms} link="CALL">
      <CreateCallRoom />
    </RoomPage>
  );
};

export default CallPage;
