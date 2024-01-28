import { createClient, LiveList, LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
  throttle: 16,
});

type Presence = {
  isTyping?: boolean;
  cursor: {
    x: number;
    y: number;
  } | null;
};

type Storage = {
  todos: LiveList<LiveObject<Todo>>;
};

type Todo = {
  roomId: string;
  text: string;
  checked?: boolean;
};

export const {
  suspense: {
    RoomProvider,
    useStorage,
    useOthers,
    useSelf,
    useUpdateMyPresence,
    useMutation,
    useMyPresence,
  },
} = createRoomContext<Presence, Storage>(client);
