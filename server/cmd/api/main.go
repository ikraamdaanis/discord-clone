package main

import (
	"github.com/ikraamdaanis/discord-clone/internal/api"
	"github.com/ikraamdaanis/discord-clone/internal/database"
	"github.com/ikraamdaanis/discord-clone/internal/initializers"
)

func init() {
	initializers.LoadVariables()
	database.ConnectDatabase()
}

func main() {
	api.RunServer()
}
