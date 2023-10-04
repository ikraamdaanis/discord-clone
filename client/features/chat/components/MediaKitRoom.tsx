"use client";

import { useUser } from "@clerk/nextjs";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type MediaRoomProps = {
  chatId: string;
  audio: boolean;
};

/** Audio/video chatroom via LiveKit. */
export const MediaKitRoom = ({ chatId, audio }: MediaRoomProps) => {
  const { user } = useUser();

  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName) return;

    const name = `${user.firstName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();

        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [chatId, user?.firstName, user?.lastName]);

  if (token === "") {
    <div className="flex flex-1 flex-col items-center justify-center">
      <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
      <p className="text-xs text-zinc-400">Loading...</p>
    </div>;
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
