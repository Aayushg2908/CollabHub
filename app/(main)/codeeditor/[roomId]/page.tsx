import { Room } from "./_components/Room";
import { joinRoom } from "@/actions";

const CodeEditorRoomPage = async ({
  params,
}: {
  params: { roomId: string };
}) => {
  const { roomId } = params;
  await joinRoom(roomId, "CODEEDITOR");

  return (
    <div className="w-full h-full">
      <Room roomId={roomId} />
    </div>
  );
};

export default CodeEditorRoomPage;
