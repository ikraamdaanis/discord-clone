import { ServerWebSocket } from "bun";
import { currentProfile } from "./currentProfile";
import { AddMessagePayload, createMessage } from "./createMessage";

type Args = {
  profileId: string;
  key: string;
};

let users: string[] = [];

const server = Bun.serve<Args>({
  port: process.env.PORT,
  fetch(req, server) {
    const url = new URL(req.url);

    const params = url.searchParams;

    const profileId = params.get("profileId");

    const success = server.upgrade(req, {
      // Set username to semi-random text, collisions probably do not use in production
      data: { profileId }
    });

    return success
      ? undefined
      : new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    open(ws) {
      console.log("OPEN DATA: ", ws.data);

      if (
        ws.data?.profileId &&
        !users.find(user => user === ws.data.profileId)
      ) {
        users.push(ws.data.profileId);
      }
    }, // a socket is opened
    async message(ws: ServerWebSocket<Args>, message) {
      console.log("WS: ", message);

      const data = JSON.parse(
        message as string
      ) as unknown as AddMessagePayload;

      if (ws.data.key) {
        ws.subscribe(ws.data.key);
      }

      if (ws.data.profileId) {
        const profile = await currentProfile(ws.data.profileId);
        console.log("MESSAGE: ", profile?.email, data);

        if (!profile) return;

        if (data.content) {
          const message = await createMessage({
            ...data,
            profile
          });

          if (message) {
            ws.send(JSON.stringify(message));

            console.log("MESSAGE: ", message, data.key);
          }
        }
      }
      ws.publish(
        data.key,
        JSON.stringify({ type: "MESSAGES_ADD", data: message })
      );
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
