#!make
include .env

install: 
	go mod tidy

dev:
	go run cmd/api/main.go

generate-ts:
	go run cmd/schema/main.go
