"use client";

import Cursor from "@/components/Cursor";
import { Loading } from "@/components/Loading";
import {
  RoomProvider,
  useMutation,
  useOthers,
  useOthersMapped,
  useSelf,
  useStorage,
  useUpdateMyPresence,
} from "@/liveblocks.config";
import { Layer } from "@/types";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import {
  Avatar,
  AvatarGroup,
  Input,
  Snippet,
  Tooltip,
} from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export const Room = ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
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
        messages: new LiveList(),
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => <Chat roomId={roomId} userId={userId} />}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

const Chat = ({ roomId, userId }: { roomId: string; userId: string }) => {
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const updateMyPresence = useUpdateMyPresence();
  const currentUser = useSelf();
  const others = useOthersMapped((other) => ({
    cursor: other.presence.cursor,
    info: other.info,
  }));

  const messages = useStorage((root) =>
    root.messages.filter((message) => message.roomId === roomId)
  );

  const addMessage = useMutation(({ storage }, content) => {
    storage
      .get("messages")
      .push(
        new LiveObject({ content: content, roomId: roomId, senderId: userId })
      );
  }, []);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const deleteMessage = useMutation(({ storage }, index) => {
    const message = storage.get("messages").get(index);
    message?.set("isDeleted", true);
  }, []);

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
      className="h-screen w-full relative touch-none flex flex-col overflow-scroll"
    >
      <div className="w-full fixed top-[65px] flex justify-between items-center max-[419px]:flex-col max-[419px]:gap-y-1">
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

      <div className="flex flex-col gap-y-2 w-full mt-[80px] max-[419px]:mt-[150px] px-2">
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`w-full flex ${
                message.senderId === userId && "items-end justify-end"
              }`}
            >
              <div
                className={`${
                  message.senderId === userId && "bg-blue-500 text-white"
                } w-fit min-w-[100px] flex items-center justify-center p-3 gap-x-2 rounded-full ${
                  message.senderId !== userId && "bg-neutral-700 text-white"
                }`}
              >
                {message.isDeleted ? (
                  "This Message was deleted"
                ) : (
                  <span>{message.content}</span>
                )}
                {userId === message.senderId && (
                  <Trash2
                    onClick={() => deleteMessage(index)}
                    className="w-5 h-5 fill-red-500 cursor-pointer"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={ref} className="mb-[100px]" />

      <div className="w-full px-4 mb-2 bottom-2 fixed flex flex-col gap-y-1">
        <SomeoneIsTyping />
        <Input
          className="w-full"
          size="sm"
          placeholder="Type Your Message Here"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            updateMyPresence({ isTyping: true });
          }}
          onKeyDown={(e) => {
            if (message && e.key === "Enter") {
              updateMyPresence({ isTyping: false });
              addMessage(message);
              setMessage("");
            }
          }}
          onBlur={() => updateMyPresence({ isTyping: false })}
        />
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

const SomeoneIsTyping = () => {
  const someoneIsTyping = useOthers((others) =>
    others.some((other) => other.presence.isTyping)
  );

  return (
    <div className="font-semibold text-base text-blue-400">
      {someoneIsTyping ? "Someone is typing..." : ""}
    </div>
  );
};
