import React from "react";
import { Room } from "./_components/Room";
import { joinRoom } from "@/actions";

const WhiteboardRoomIdPage = async ({
  params,
}: {
  params: { roomId: string };
}) => {
  const { roomId } = params;
  await joinRoom(roomId, "WHITEBOARD");

  return (
    <div className="w-full h-full">
      <Room roomId={roomId} />
    </div>
  );
};

export default WhiteboardRoomIdPage;
