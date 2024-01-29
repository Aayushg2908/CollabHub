import { joinTextEditorRoom } from "@/actions/texteditor";
import { Room } from "./_components/Room";

const TextEditorRoomPage = async ({
  params,
}: {
  params: { roomId: string };
}) => {
  const { roomId } = params;
  await joinTextEditorRoom(roomId);

  return (
    <div className="w-full h-full">
      <Room roomId={roomId} />
    </div>
  );
};

export default TextEditorRoomPage;
