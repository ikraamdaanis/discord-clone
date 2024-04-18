#!make
include .env

install:
	bun install
	bunx prisma generate

dev:
	PORT="${CLIENT_PORT}" bun dev

ts-lint:
	bun ts-lint

update-db:
	bunx prisma db push