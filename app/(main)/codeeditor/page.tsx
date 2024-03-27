import { getAllRooms, getOwnedRooms } from "@/actions";
import { CreateCodeEditorRoom } from "./_components/CreateCodeEditorRoom";
import RoomPage from "@/components/RoomPage";

const CodeEditorPage = async () => {
  const ownedRooms = await getOwnedRooms("CODEEDITOR");
  const allRooms = await getAllRooms("CODEEDITOR");

  return (
    <RoomPage ownedRooms={ownedRooms} allRooms={allRooms} link="CODEEDITOR">
      <CreateCodeEditorRoom />
    </RoomPage>
  );
};

export default CodeEditorPage;
