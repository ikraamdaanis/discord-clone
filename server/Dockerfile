FROM oven/bun

WORKDIR /usr/src/index

COPY package*.json bun.lockb ./
COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node
COPY prisma ./prisma/
RUN bun install
RUN bunx prisma generate
COPY . .

ENV NODE_ENV production

CMD [ "bun", "start" ]