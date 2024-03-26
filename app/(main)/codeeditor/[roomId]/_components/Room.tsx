"use client";

import Cursor from "@/components/Cursor";
import { Loading } from "@/components/Loading";
import {
  RoomProvider,
  TypedLiveblocksProvider,
  useOthersMapped,
  useRoom,
  useSelf,
  useUpdateMyPresence,
} from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Snippet,
  Tooltip,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import { Toolbar } from "@/components/Toolbar";

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
      className="relative flex flex-col h-full w-full items-center"
    >
      <Snippet symbol="" className="absolute top-0 mt-10">
        https://collab-hub-one.vercel.app/codeeditor/{roomId}
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

      <div className="absolute mt-40 top-10 w-2/3 max-md:w-full text-start px-8">
        <CollaborativeEditor />
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

const CollaborativeEditor = () => {
  const room = useRoom();
  const [provider, setProvider] = useState<TypedLiveblocksProvider>();
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [runningCode, setRunningCode] = useState(false);
  const [output, setOutput] = useState("");

  useEffect(() => {
    let yProvider: TypedLiveblocksProvider;
    let yDoc: Y.Doc;
    let binding: MonacoBinding;

    if (editorRef) {
      yDoc = new Y.Doc();
      const yText = yDoc.getText("monaco");
      yProvider = new LiveblocksProvider(room, yDoc);
      setProvider(yProvider);

      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        yProvider.awareness as Awareness
      );
    }

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
      binding?.destroy();
    };
  }, [editorRef, room]);

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  const handleCodeRun = async () => {
    if (editorRef) {
      setRunningCode(true);
      const code = editorRef.getValue();
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "typescript",
          version: "5.0.3",
          files: [
            {
              content: code,
            },
          ],
        }),
      });
      const data = await response.json();
      setOutput(data.run.stdout);
      setRunningCode(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col pb-10">
      <div className="w-full flex items-center justify-center gap-x-2">
        <Button disabled={runningCode} onClick={handleCodeRun} color="primary">
          {runningCode ? "Running..." : "Run"}
        </Button>
        {editorRef ? <Toolbar editor={editorRef} /> : null}
      </div>
      <div className="relative flex-grow mt-2">
        <Editor
          className="w-[300px] h-[350px]"
          onMount={handleOnMount}
          theme="vs-dark"
          defaultLanguage="typescript"
          defaultValue=""
          options={{
            tabSize: 2,
            padding: { top: 20 },
          }}
        />
      </div>
      {output && (
        <div className="mt-4 flex flex-col">
          <h1>Output:</h1>
          <div className="flex-grow mt-2">
            <div className="text-white bg-gray-800 p-4 rounded-md">
              <pre className="w-fit">{output}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
