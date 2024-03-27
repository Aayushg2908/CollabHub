import { CreateTextEditorRoom } from "./_components/CreateTextEditorRoom";
import RoomPage from "@/components/RoomPage";
import { getAllRooms, getOwnedRooms } from "@/actions";

const TextEditorPage = async () => {
  const ownedRooms = await getOwnedRooms("TEXTEDITOR");
  const allRooms = await getAllRooms("TEXTEDITOR");

  return (
    <RoomPage ownedRooms={ownedRooms} allRooms={allRooms} link="TEXTEDITOR">
      <CreateTextEditorRoom />
    </RoomPage>
  );
};

export default TextEditorPage;
