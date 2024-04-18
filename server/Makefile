#!make
include .env

install:
	bun install
	bunx prisma generate

dev:
	bun --hot run index.ts
