"use client";

import { useSocket } from "components/providers/socket-provider";
import { Badge } from "components/ui/badge";

/** Indicator that shows if client is connected to the server via websocket. */
export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="flex w-[100px] items-center justify-center border-none bg-yellow-600 text-white"
      >
        <span>Connecting...</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="flex w-[100px] items-center justify-center border-none bg-emerald-600 text-white"
    >
      <span>Connected</span>
    </Badge>
  );
};
