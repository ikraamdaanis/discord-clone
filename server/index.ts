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
      if (
        ws.data?.profileId &&
        !users.find(user => user === ws.data.profileId)
      ) {
        users.push(ws.data.profileId);
      }

      const payload = {
        users,
        key: "users",
        from: "open"
      };

      ws.subscribe("users");

      server.publish("users", JSON.stringify(payload));
    },
    async message(ws: ServerWebSocket<Args>, message) {
      const data = JSON.parse(
        message as string
      ) as unknown as AddMessagePayload;

      if (data.key) {
        ws.subscribe(data.key);
      }

      if (ws.data.profileId) {
        const profile = await currentProfile(ws.data.profileId);

        if (!profile) return;

        if (data.content) {
          const message = await createMessage({
            ...data,
            profile
          });

          if (message) {
            const payload = {
              key: data.key,
              data: message
            };

            server.publish(data.key, JSON.stringify(payload));
          }
        }
      }
    },
    close(ws, code, message) {
      users = users.filter(user => user !== ws.data.profileId);

      const payload = {
        users,
        key: "users",
        from: "close"
      };

      ws.unsubscribe("users");

      server.publish("users", JSON.stringify(payload));
    }
  }
});

console.log(`Listening on http://localhost:${server.port}...`);
