#!make
include .env.local

install: 
	make install-client && make install-server

install-client:
	cd client && pnpm install 

install-server:
	cd server && go mod tidy

dev-client:
	cd client && pnpm dev

dev-ts:
	cd client && pnpm ts-lint

dev-server:
	cd server && go run main.go
