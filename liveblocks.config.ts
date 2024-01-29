import { createClient, LiveList, LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import LiveblocksProvider from "@liveblocks/yjs";

const client = createClient({
  throttle: 16,
  authEndpoint: "/api/liveblocks-auth",
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

type UserMeta = {
  id: string;
  info: {
    name: string;
    avatar: string;
  };
};

type RoomEvent = {};

export type TypedLiveblocksProvider = LiveblocksProvider<
  Presence,
  Storage,
  UserMeta,
  RoomEvent
>;

export const {
  suspense: {
    RoomProvider,
    useStorage,
    useOthers,
    useSelf,
    useUpdateMyPresence,
    useMutation,
    useMyPresence,
    useOthersMapped,
    useRoom,
  },
} = createRoomContext<Presence, Storage>(client);
