"use client";

import Cursor from "@/components/Cursor";
import { Loading } from "@/components/Loading";
import {
  RoomProvider,
  useMyPresence,
  useOthers,
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
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence();

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
      {others.map(({ connectionId, presence }) => {
        if (presence == null || !presence.cursor) {
          return null;
        }

        return (
          <Cursor
            key={connectionId}
            color={COLORS[connectionId % COLORS.length]}
            x={presence.cursor.x}
            y={presence.cursor.y}
          />
        );
      })}
    </main>
  );
};
