"use client";

import { useSocket } from "components/providers/socket-provider";
import { cn } from "lib/utils";

/** Indicator that shows if client is connected to the server via websocket. */
export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  return (
    <div
      className={cn(
        "h-3 w-3 items-center justify-center rounded-full border-none bg-emerald-600 text-white",
        !isConnected && "bg-yellow-600"
      )}
    />
  );
};
