import {
  createClient,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import LiveblocksProvider from "@liveblocks/yjs";
import { Color, Layer } from "./types";

const client = createClient({
  throttle: 16,
  authEndpoint: "/api/liveblocks-auth",
});

type Presence = {
  selection: string[];
  isTyping: boolean;
  cursor: {
    x: number;
    y: number;
  } | null;
  pencilDraft: [x: number, y: number, pressure: number][] | null;
  penColor: Color | null;
};

type Storage = {
  todos: LiveList<LiveObject<Todo>>;
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
  messages: LiveList<LiveObject<Message>>;
};

type Todo = {
  roomId: string;
  text: string;
  checked?: boolean;
};

type Message = {
  roomId: string;
  content: string;
  senderId: string;
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
    useCanRedo,
    useCanUndo,
    useHistory,
  },
} = createRoomContext<Presence, Storage>(client);
