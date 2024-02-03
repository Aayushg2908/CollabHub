"use client";

import Cursor from "@/components/Cursor";
import { Loading } from "@/components/Loading";
import {
  RoomProvider,
  useOthersMapped,
  useRoom,
  useSelf,
  useUpdateMyPresence,
} from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { Avatar, AvatarGroup, Snippet, Tooltip } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export const Room = ({ roomId }: { roomId: string }) => {
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
  const updateMyPresence = useUpdateMyPresence();

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
      className="relative flex flex-col h-full w-full items-center overflow-hidden"
    >
      <Snippet symbol="" className="absolute top-0 mt-10">
        https://collab-hub-one.vercel.app/texteditor/{roomId}
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

      <div className="absolute mt-44 top-10 w-2/3 max-md:w-full text-start px-8">
        <MyComponent />
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

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function MyComponent() {
  return (
    <ErrorBoundary>
      <CollaborativeEditor />
    </ErrorBoundary>
  );
}

const CollaborativeEditor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);
  if (!doc || !provider) {
    return null;
  }

  return <BlockNote doc={doc} provider={provider} />;
};

const BlockNote = ({ doc, provider }: { doc: Y.Doc; provider: any }) => {
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useBlockNote({
    collaboration: {
      provider,

      fragment: doc.getXmlFragment("document-store"),

      user: {
        name: userInfo?.name || "",
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      },
    },
  });

  return <BlockNoteView editor={editor} theme={"dark"} />;
};
