package schema

import (
	"time"
)

type Profile struct {
	ID       string `gorm:"primaryKey"`
	UserID   string `gorm:"unique"`
	Name     string
	ImageURL string `gorm:"type:text"`
	Email    string `gorm:"type:text"`

	Servers  []Server
	Members  []Member
	Channels []Channel

	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time
}

type Server struct {
	ID         string `gorm:"primaryKey"`
	Name       string
	ImageURL   string `gorm:"type:text"`
	InviteCode string `gorm:"unique"`

	ProfileID string
	Profile   Profile `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE"`

	Members  []Member
	Channels []Channel

	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time
}

type Member struct {
	ID   string `gorm:"primaryKey"`
	Role string `gorm:"default:GUEST"`

	ProfileID string
	Profile   Profile `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE"`

	ServerID string
	Server   Server `gorm:"foreignKey:ServerID;references:ID;onDelete:CASCADE"`

	Messages       []Message
	DirectMessages []DirectMessage

	ConversationsInitiated []Conversation `gorm:"foreignKey:MemberOneID"`
	ConversationsReceived  []Conversation `gorm:"foreignKey:MemberTwoID"`

	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time
}

type ChannelType string

const (
	ChannelTypeText  ChannelType = "TEXT"
	ChannelTypeAudio ChannelType = "AUDIO"
	ChannelTypeVideo ChannelType = "VIDEO"
)

type Channel struct {
	ID   string `gorm:"primaryKey"`
	Name string
	Type ChannelType `gorm:"default:TEXT"`

	ProfileID string
	Profile   Profile `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE"`

	ServerID string
	Server   Server `gorm:"foreignKey:ServerID;references:ID;onDelete:CASCADE"`

	Messages []Message

	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time
}

type Message struct {
	ID      string `gorm:"primaryKey"`
	Content string `gorm:"type:text"`

	FileURL string `gorm:"type:text"`

	MemberID string
	Member   Member `gorm:"foreignKey:MemberID;references:ID;onDelete:CASCADE"`

	ChannelID string
	Channel   Channel `gorm:"foreignKey:ChannelID;references:ID;onDelete:CASCADE"`

	Deleted bool `gorm:"default:false"`

	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time
}

type Conversation struct {
	ID string `gorm:"primaryKey"`

	MemberOneID string
	MemberOne   Member `gorm:"foreignKey:MemberOneID;references:ID;onDelete:CASCADE"`

	MemberTwoID string
	MemberTwo   Member `gorm:"foreignKey:MemberTwoID;references:ID;onDelete:CASCADE"`

	DirectMessages []DirectMessage

	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time
}

type DirectMessage struct {
	ID      string `gorm:"primaryKey"`
	Content string `gorm:"type:text"`
	FileURL string `gorm:"type:text"`

	MemberID string
	Member   Member `gorm:"foreignKey:MemberID;references:ID;onDelete:CASCADE"`

	ConversationID string
	Conversation   Conversation `gorm:"foreignKey:ConversationID;references:ID;onDelete:CASCADE"`

	Deleted bool `gorm:"default:false"`

	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time
}
