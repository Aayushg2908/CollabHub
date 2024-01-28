"use client";

import Cursor from "@/components/Cursor";
import { Loading } from "@/components/Loading";
import {
  RoomProvider,
  useOthers,
  useOthersMapped,
  useUpdateMyPresence,
} from "@/liveblocks.config";
import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { Room as PrismaRoom } from "@prisma/client";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export const Room = ({ room }: { room: PrismaRoom }) => {
  const roomId = room.id;

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        isTyping: false,
        cursor: null,
      }}
      initialStorage={{
        todos: new LiveList(),
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => <MainRoom />}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

const MainRoom = () => {
  const others = useOthersMapped((other) => ({
    cursor: other.presence.cursor,
    info: other.info,
  }));
  const updateMyPresence = useUpdateMyPresence();

  return (
    <main
      onPointerMove={(event) => {
        const newCursor = {
          x: event.clientX,
          y: event.clientY,
        };
        console.log("Cursor ", newCursor);
        updateMyPresence({
          cursor: newCursor,
        });
      }}
      onPointerLeave={() =>
        updateMyPresence({
          cursor: null,
        })
      }
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      {others.map(([id, other]) => {
        if (other.cursor == null) {
          return null;
        }

        return (
          <Cursor
            key={id}
            color={COLORS[id % COLORS.length]}
            x={other.cursor.x}
            y={other.cursor.y}
            name={other.info?.name}
          />
        );
      })}
    </main>
  );
};
