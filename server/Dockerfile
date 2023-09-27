FROM oven/bun

WORKDIR /usr/src/index

COPY package*.json bun.lockb prisma ./
RUN bun install
RUN bunx prisma generate
COPY . .

ENV NODE_ENV production

CMD [ "bun", "start" ]