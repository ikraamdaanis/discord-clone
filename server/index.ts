const server = Bun.serve({
  port: process.env.PORT,
  fetch(req) {
    return new Response(`Hello world`);
  }
});

console.log(`Listening on http://localhost:${server.port}...`);
