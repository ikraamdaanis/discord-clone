#!make
include .env.local

install: 
	make install-server && make install-client

install-server:
	cd server && make dev

dev-server:
	cd server && make dev

install-client:
	cd client && make install

dev-client:
	cd client && make dev

dev-ts:
	cd client && make ts-lint


