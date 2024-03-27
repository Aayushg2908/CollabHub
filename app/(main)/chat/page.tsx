import { getAllRooms, getOwnedRooms } from "@/actions";
import { CreateChatRoom } from "./_components/CreateChatRoom";
import RoomPage from "@/components/RoomPage";

const ChatPage = async () => {
  const ownedRooms = await getOwnedRooms("CHAT");
  const allRooms = await getAllRooms("CHAT");

  return (
    <RoomPage ownedRooms={ownedRooms} allRooms={allRooms} link="CHAT">
      <CreateChatRoom />
    </RoomPage>
  );
};

export default ChatPage;
