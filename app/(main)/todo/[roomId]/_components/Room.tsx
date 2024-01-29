"use client";

import Cursor from "@/components/Cursor";
import { Loading } from "@/components/Loading";
import {
  RoomProvider,
  useOthersMapped,
  useSelf,
  useUpdateMyPresence,
} from "@/liveblocks.config";
import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { Avatar, AvatarGroup, Tooltip } from "@nextui-org/react";
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
  const currentUser = useSelf();
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
      className="relative flex h-screen w-full justify-center overflow-hidden"
    >
      <AvatarGroup className="absolute top-0 mt-10">
        {others.slice(0, 3).map(([id, other]) => {
          return (
            <Tooltip content={other.info?.name}>
              <Avatar
                key={id}
                src={other.info?.avatar}
                name={other.info?.name}
              />
            </Tooltip>
          );
        })}
        {currentUser && (
          <Tooltip content={currentUser.info?.name}>
            <Avatar src={currentUser.info?.avatar} name="You" />
          </Tooltip>
        )}
      </AvatarGroup>

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
