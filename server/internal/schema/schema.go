package schema

import (
	"time"

	"github.com/google/uuid"
)

type Profile struct {
	ID       uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID   uuid.UUID `gorm:"type:uuid;unique"`
	Name     string
	ImageURL string `gorm:"type:text"`
	Email    string `gorm:"type:text"`

	Servers  []Server
	Members  []Member
	Channels []Channel

	CreatedAt time.Time
	UpdatedAt time.Time
}

type Server struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name       string
	ImageURL   string `gorm:"type:text"`
	InviteCode string `gorm:"unique"`

	ProfileID uuid.UUID `gorm:"type:uuid"`
	Profile   Profile   `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE"`

	Members  []Member
	Channels []Channel

	CreatedAt time.Time
	UpdatedAt time.Time
}

type MemberRole string

const (
	Admin     MemberRole = "ADMIN"
	Moderator MemberRole = "MODERATOR"
	Guest     MemberRole = "GUEST"
)

type Member struct {
	ID   uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Role MemberRole `gorm:"default:GUEST"`

	ProfileID uuid.UUID `gorm:"type:uuid"`
	Profile   Profile   `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE"`

	ServerID uuid.UUID `gorm:"type:uuid"`
	Server   Server    `gorm:"foreignKey:ServerID;references:ID;onDelete:CASCADE"`

	Messages       []Message
	DirectMessages []DirectMessage

	ConversationsInitiated []Conversation `gorm:"foreignKey:MemberOneID"`
	ConversationsReceived  []Conversation `gorm:"foreignKey:MemberTwoID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type ChannelType string

const (
	ChannelTypeText  ChannelType = "TEXT"
	ChannelTypeAudio ChannelType = "AUDIO"
	ChannelTypeVideo ChannelType = "VIDEO"
)

type Channel struct {
	ID   uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name string
	Type ChannelType `gorm:"default:TEXT"`

	ProfileID uuid.UUID `gorm:"type:uuid"`
	Profile   Profile   `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE"`

	ServerID uuid.UUID `gorm:"type:uuid"`
	Server   Server    `gorm:"foreignKey:ServerID;references:ID;onDelete:CASCADE"`

	Messages []Message

	CreatedAt time.Time
	UpdatedAt time.Time
}

type Message struct {
	ID      uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Content string    `gorm:"type:text"`

	FileURL string `gorm:"type:text"`

	MemberID uuid.UUID `gorm:"type:uuid"`
	Member   Member    `gorm:"foreignKey:MemberID;references:ID;onDelete:CASCADE"`

	ChannelID uuid.UUID `gorm:"type:uuid"`
	Channel   Channel   `gorm:"foreignKey:ChannelID;references:ID;onDelete:CASCADE"`

	Deleted bool `gorm:"default:false"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type Conversation struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	MemberOneID uuid.UUID `gorm:"type:uuid"`
	MemberOne   Member    `gorm:"foreignKey:MemberOneID;references:ID;onDelete:CASCADE"`

	MemberTwoID uuid.UUID `gorm:"type:uuid"`
	MemberTwo   Member    `gorm:"foreignKey:MemberTwoID;references:ID;onDelete:CASCADE"`

	DirectMessages []DirectMessage

	CreatedAt time.Time
	UpdatedAt time.Time
}

type DirectMessage struct {
	ID      uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Content string    `gorm:"type:text"`
	FileURL string    `gorm:"type:text"`

	MemberID uuid.UUID `gorm:"type:uuid"`
	Member   Member    `gorm:"foreignKey:MemberID;references:ID;onDelete:CASCADE"`

	ConversationID uuid.UUID    `gorm:"type:uuid"`
	Conversation   Conversation `gorm:"foreignKey:ConversationID;references:ID;onDelete:CASCADE"`

	Deleted bool `gorm:"default:false"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
