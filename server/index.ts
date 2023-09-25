import { ServerWebSocket } from "bun";

type Args = {
  channelId: string;
};

const server = Bun.serve({
  port: process.env.PORT,
  fetch(req, server) {
    const success = server.upgrade(req, {
      // Set username to semi-random text, collisions probably do not use in production
      data: { username: "user_" + Math.random().toString(16).slice(12) }
    });

    const url = new URL(req.url);

    return success
      ? undefined
      : new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    open(ws) {
      console.log("OPEN: ", ws);
    }, // a socket is opened
    message(ws: ServerWebSocket<Args>, message) {
      // console.log("WS: ", ws);
      console.log("MESSAGE: ", message);

      const updateKey = `chat:${ws.data.channelId}:messages:update`;

      ws.publish(updateKey, "Hi");
    }, // a message is received
    close(ws, code, message) {
      console.log("CLOSE: ", ws, code, message);
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
