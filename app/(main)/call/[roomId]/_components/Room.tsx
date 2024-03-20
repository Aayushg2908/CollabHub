"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loading } from "@/components/Loading";
import { useRouter } from "next/navigation";

const Room = ({ roomId, username }: { roomId: string; username: string }) => {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${roomId}&username=${username}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [roomId, username]);

  if (token === "") {
    return <Loading />;
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100dvh" }}
      onDisconnected={() => router.push("/call")}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default Room;
