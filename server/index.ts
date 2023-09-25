import { ServerWebSocket } from "bun";
import { currentProfile } from "./currentProfile";

type Args = {
  profileId: string;
};

let users: string[] = [];

const server = Bun.serve<Args>({
  port: process.env.PORT,
  fetch(req, server) {
    const url = new URL(req.url);

    const params = url.searchParams;

    console.log("URL: ", url.pathname, params);

    const profileId = params.get("profileId");

    const success = server.upgrade(req, {
      // Set username to semi-random text, collisions probably do not use in production
      data: { profileId }
    });

    console.log("HE: ", profileId);

    return success
      ? undefined
      : new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    open(ws) {
      // console.log("OPEN: ", ws);

      if (
        ws.data?.profileId &&
        !users.find(user => user === ws.data.profileId)
      ) {
        console.log("GO: ", ws.data);
        users.push(ws.data.profileId);
      }
    }, // a socket is opened
    async message(ws: ServerWebSocket<Args>, message) {
      // console.log("WS: ", ws);

      const data = JSON.parse(message as string);
      if (ws.data.profileId) {
        const profile = await currentProfile(ws.data.profileId);
        console.log("MESSAGE: ", profile?.email);
      }
    }, // a message is received
    close(ws, code, message) {
      console.log("CLOSE: ");

      users = users.filter(user => user !== ws.data.profileId);
    }, // a socket is closed
    drain(ws) {} // the socket is ready to receive more data
  }
});

const socket = new WebSocket(`ws://localhost:${process.env.PORT || 5000}/`);

socket.addEventListener("message", event => {
  console.log("event");
  console.log(event.data);
});

console.log(`Listening on http://localhost:${server.port}...`);
