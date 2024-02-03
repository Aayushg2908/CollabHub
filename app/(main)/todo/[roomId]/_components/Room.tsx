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
import { Room as PrismaRoom } from "@prisma/client";
import { useState } from "react";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export const Room = ({ room }: { room: PrismaRoom }) => {
  const roomId = room.id;

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        isTyping: false,
        cursor: null,
        selection: [],
        pencilDraft: null,
        penColor: null,
      }}
      initialStorage={{
        todos: new LiveList(),
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList<string>(),
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => <MainRoom roomId={roomId} />}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

const MainRoom = ({ roomId }: { roomId: string }) => {
  const currentUser = useSelf();
  const others = useOthersMapped((other) => ({
    cursor: other.presence.cursor,
    info: other.info,
  }));
  const [draft, setDraft] = useState("");
  const updateMyPresence = useUpdateMyPresence();
  const todos = useStorage((root) =>
    root.todos.filter((todo) => todo.roomId === roomId)
  );

  const addTodo = useMutation(({ storage }, text) => {
    storage.get("todos").push(new LiveObject({ text, roomId: roomId }));
  }, []);

  const toggleTodo = useMutation(({ storage }, index) => {
    const todo = storage.get("todos").get(index);
    todo?.set("checked", !todo.get("checked"));
  }, []);

  const deleteTodo = useMutation(({ storage }, index) => {
    storage.get("todos").delete(index);
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
      className="relative flex flex-col h-screen w-full items-center overflow-hidden"
    >
      <Snippet symbol="" className="absolute top-0 mt-10">
        http://localhost:3000/todo/{roomId}
      </Snippet>
      <AvatarGroup className="absolute top-0 mt-32">
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

      <div className="container absolute top-10 mt-40 flex flex-col items-center px-1 gap-y-2">
        <Input
          className="w-1/2 max-sm:w-full"
          label="What needs to be done?"
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            updateMyPresence({ isTyping: true });
          }}
          onKeyDown={(e) => {
            if (draft && e.key === "Enter") {
              updateMyPresence({ isTyping: false });
              addTodo(draft);
              setDraft("");
            }
          }}
          onBlur={() => updateMyPresence({ isTyping: false })}
        />
        <SomeoneIsTyping />
        {todos.map((todo, index) => {
          return (
            <div
              key={index}
              className="w-1/2 max-sm:w-full flex items-center justify-between"
            >
              <div className="todo" onClick={() => toggleTodo(index)}>
                <span
                  className="font-bold text-lg"
                  style={{
                    cursor: "pointer",
                    textDecoration: todo.checked ? "line-through" : undefined,
                  }}
                >
                  {todo.text}
                </span>
              </div>
              <button
                className="w-6 h-6 text-red-400"
                onClick={() => deleteTodo(index)}
              >
                ✕
              </button>
            </div>
          );
        })}
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

export const SomeoneIsTyping = () => {
  const someoneIsTyping = useOthers((others) =>
    others.some((other) => other.presence.isTyping)
  );

  return (
    <div className="font-semibold text-base text-blue-400">
      {someoneIsTyping ? "Someone is typing..." : ""}
    </div>
  );
};
