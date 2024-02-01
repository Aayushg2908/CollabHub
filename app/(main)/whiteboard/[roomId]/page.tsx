import { joinWhiteboardRoom } from "@/actions/whiteboard";
import React from "react";
import { Room } from "./_components/Room";

const WhiteboardRoomIdPage = async ({
  params,
}: {
  params: { roomId: string };
}) => {
  const { roomId } = params;
  await joinWhiteboardRoom(roomId);

  return (
    <div className="w-full h-full">
      <Room roomId={roomId} />
    </div>
  );
};

export default WhiteboardRoomIdPage;
