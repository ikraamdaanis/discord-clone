package database

import (
	"log"
	"os"

	"github.com/fatih/color"
	"github.com/ikraamdaanis/discord-clone/internal/schema"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	DB, err = gorm.Open(postgres.Open(os.Getenv("DB_DSN")), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to the database: ", err)
	}

	boldCyanUnderlined := color.New(color.FgCyan).Add(color.Bold)
	boldGreenUnderlined := color.New(color.FgGreen).Add(color.Bold)

	boldCyanUnderlined.Println("Successfully connected to the database.")

	err = DB.AutoMigrate(
		&schema.Profile{},
		&schema.Server{},
		&schema.Member{},
		&schema.Channel{},
		&schema.Message{},
		&schema.Conversation{},
		&schema.DirectMessage{},
	)

	if err != nil {
		log.Println("Error migrating database: ", err)
	}

	boldGreenUnderlined.Println("Successfully migrated models to the database.")
}
