import { joinCodeEditorRoom } from "@/actions/codeeditor";
import { Room } from "./_components/Room";

const CodeEditorRoomPage = async ({
  params,
}: {
  params: { roomId: string };
}) => {
  const { roomId } = params;
  await joinCodeEditorRoom(roomId);

  return (
    <div className="w-full h-full">
      <Room roomId={roomId} />
    </div>
  );
};

export default CodeEditorRoomPage;
