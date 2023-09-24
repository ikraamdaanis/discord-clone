import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "types";

export const config = {
  api: {
    bodyParser: false
  }
};

async function ioHandler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: path,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      addTrailingSlash: false
    });
    res.socket.server.io = io;
  }

  res.end();
}

export default ioHandler;
