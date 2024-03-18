"use client";

import Cursor from "@/components/Cursor";
import { Loading } from "@/components/Loading";
import {
  RoomProvider,
  useOthersMapped,
  useSelf,
  useUpdateMyPresence,
} from "@/liveblocks.config";
import { Layer } from "@/types";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { Avatar, AvatarGroup, Snippet, Tooltip } from "@nextui-org/react";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export const Room = ({ roomId }: { roomId: string }) => {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selection: [],
        pencilDraft: null,
        penColor: null,
        isTyping: false,
      }}
      initialStorage={{
        todos: new LiveList(),
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList(),
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => <Chat roomId={roomId} />}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

const Chat = ({ roomId }: { roomId: string }) => {
  const updateMyPresence = useUpdateMyPresence();
  const currentUser = useSelf();
  const others = useOthersMapped((other) => ({
    cursor: other.presence.cursor,
    info: other.info,
  }));

  return (
    <main
      onPointerMove={(event) => {
        const newCursor = {
          x: event.clientX,
          y: event.clientY,
        };
        updateMyPresence({
          cursor: newCursor,
        });
      }}
      onPointerLeave={() =>
        updateMyPresence({
          cursor: null,
        })
      }
      className="h-screen w-full relative touch-none flex flex-col overflow-hidden"
    >
      <div className="w-full absolute top-0 flex justify-between items-center max-[419px]:flex-col max-[419px]:gap-y-1">
        <Snippet symbol="">
          https://collab-hub-one.vercel.app/chat/{roomId}
        </Snippet>
        <AvatarGroup className="bg-neutral-800 py-2 px-6 rounded-md w-fit">
          {others.slice(0, 3).map(([id, other]) => {
            return (
              <Tooltip key={id} content={other.info?.name}>
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
      </div>

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
