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
    const socket = new WebSocket(`ws://localhost:5000/?profileId=${profileId}`);

    socket.addEventListener("open", () => {
      setIsConnected(true);
    });

    socket.addEventListener("close", () => {
      setIsConnected(false);
    });

    setSocket(socket);

    // const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
    //   path: "/api/socket/io",
    //   addTrailingSlash: false
    // });
    // socketInstance.on("connect", () => {
    //   setIsConnected(true);
    // });
    // socketInstance.on("disconnect", () => {
    //   setIsConnected(false);
    // });
    // setSocket(socketInstance);
    // return () => {
    //   socketInstance.disconnect();
    // };

    return () => {
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
