"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

type SocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({
  profileId,
  children
}: {
  profileId: string;
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/?profileId=${profileId}`
    );

    socket.addEventListener("open", () => {
      setIsConnected(true);
    });

    socket.addEventListener("close", () => {
      setIsConnected(false);
    });

    setSocket(socket);

    return () => {
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, [profileId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
