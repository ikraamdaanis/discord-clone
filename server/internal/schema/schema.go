package schema

import (
	"time"

	"github.com/google/uuid"
)

type Profile struct {
	ID       uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string" json:"id"`
	UserID   uuid.UUID `gorm:"type:uuid;unique" ts_type:"string" json:"user_id"`
	Name     string    `json:"name"`
	ImageURL string    `gorm:"type:text" json:"image_url"`
	Email    string    `gorm:"type:text" json:"email"`

	Servers  []Server  `json:"servers"`
	Members  []Member  `json:"members"`
	Channels []Channel `json:"channels"`

	CreatedAt time.Time `ts_type:"string" json:"created_at"`
	UpdatedAt time.Time `ts_type:"string" json:"updated_at"`
}

type Server struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string"`
	Name       string
	ImageURL   string `gorm:"type:text"`
	InviteCode string `gorm:"unique"`

	ProfileID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	Profile   Profile   `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE"`

	Members  []Member
	Channels []Channel

	CreatedAt time.Time `ts_type:"string"`
	UpdatedAt time.Time `ts_type:"string"`
}

type MemberRole string

const (
	Admin     MemberRole = "ADMIN"
	Moderator MemberRole = "MODERATOR"
	Guest     MemberRole = "GUEST"
)

var MemberRoleAll = []struct {
	Value  MemberRole
	TSName string
}{
	{Admin, "ADMIN"},
	{Moderator, "MODERATOR"},
	{Guest, "GUEST"},
}

type Member struct {
	ID   uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string"`
	Role MemberRole `gorm:"default:GUEST"`

	ProfileID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	Profile   Profile   `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE"`

	ServerID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	Server   Server    `gorm:"foreignKey:ServerID;references:ID;onDelete:CASCADE"`

	Messages       []Message
	DirectMessages []DirectMessage

	ConversationsInitiated []Conversation `gorm:"foreignKey:MemberOneID"`
	ConversationsReceived  []Conversation `gorm:"foreignKey:MemberTwoID"`

	CreatedAt time.Time `ts_type:"string"`
	UpdatedAt time.Time `ts_type:"string"`
}

type ChannelType string

const (
	ChannelTypeText  ChannelType = "TEXT"
	ChannelTypeAudio ChannelType = "AUDIO"
	ChannelTypeVideo ChannelType = "VIDEO"
)

var ChannelTypeAll = []struct {
	Value  ChannelType
	TSName string
}{
	{ChannelTypeText, "TEXT"},
	{ChannelTypeAudio, "AUDIO"},
	{ChannelTypeVideo, "VIDEO"},
}

type Channel struct {
	ID   uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey;" ts_type:"string"`
	Name string
	Type ChannelType `gorm:"default:TEXT"`

	ProfileID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	Profile   Profile   `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE"`

	ServerID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	Server   Server    `gorm:"foreignKey:ServerID;references:ID;onDelete:CASCADE"`

	Messages []Message

	CreatedAt time.Time `ts_type:"string"`
	UpdatedAt time.Time `ts_type:"string"`
}

type Message struct {
	ID      uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string"`
	Content string    `gorm:"type:text"`

	FileURL string `gorm:"type:text"`

	MemberID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	Member   Member    `gorm:"foreignKey:MemberID;references:ID;onDelete:CASCADE"`

	ChannelID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	Channel   Channel   `gorm:"foreignKey:ChannelID;references:ID;onDelete:CASCADE"`

	Deleted bool `gorm:"default:false"`

	CreatedAt time.Time `ts_type:"string"`
	UpdatedAt time.Time `ts_type:"string"`
}

type Conversation struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string"`

	MemberOneID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	MemberOne   Member    `gorm:"foreignKey:MemberOneID;references:ID;onDelete:CASCADE"`

	MemberTwoID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	MemberTwo   Member    `gorm:"foreignKey:MemberTwoID;references:ID;onDelete:CASCADE"`

	DirectMessages []DirectMessage

	CreatedAt time.Time `ts_type:"string"`
	UpdatedAt time.Time `ts_type:"string"`
}

type DirectMessage struct {
	ID      uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string"`
	Content string    `gorm:"type:text"`
	FileURL string    `gorm:"type:text"`

	MemberID uuid.UUID `gorm:"type:uuid" ts_type:"string"`
	Member   Member    `gorm:"foreignKey:MemberID;references:ID;onDelete:CASCADE"`

	ConversationID uuid.UUID    `gorm:"type:uuid" ts_type:"string"`
	Conversation   Conversation `gorm:"foreignKey:ConversationID;references:ID;onDelete:CASCADE"`

	Deleted bool `gorm:"default:false"`

	CreatedAt time.Time `ts_type:"string"`
	UpdatedAt time.Time `ts_type:"string"`
}
