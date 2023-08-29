package main

import (
	"github.com/ikraamdaanis/discord-clone/internal/schema"
	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
)

func main() {
	converter := typescriptify.New().WithInterface(true).WithBackupDir("").Add(schema.Profile{}).Add(schema.Server{}).Add(schema.Member{}).Add(schema.Channel{}).Add(schema.Message{}).Add(schema.Conversation{}).Add(schema.DirectMessage{}).AddEnum(schema.MemberRoleAll).AddEnum(schema.ChannelTypeAll)

	err := converter.ConvertToFile("../client/types/schema.ts")

	if err != nil {
		panic(err.Error())
	}
}
