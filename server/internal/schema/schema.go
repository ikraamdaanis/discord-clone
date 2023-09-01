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
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string" json:"id"`
	Name       string    `json:"name"`
	ImageURL   string    `gorm:"type:text" json:"image_url"`
	InviteCode string    `gorm:"unique" json:"invite_code"`

	ProfileID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"profile_id"`
	Profile   Profile   `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE" json:"profile"`

	Members  []Member  `json:"members"`
	Channels []Channel `json:"channels"`

	CreatedAt time.Time `ts_type:"string" json:"created_at"`
	UpdatedAt time.Time `ts_type:"string" json:"updated_at"`
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
	ID   uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string" json:"id"`
	Role MemberRole `gorm:"default:GUEST" json:"role"`

	ProfileID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"profile_id"`
	Profile   Profile   `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE" json:"profile"`

	ServerID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"server_id"`
	Server   Server    `gorm:"foreignKey:ServerID;references:ID;onDelete:CASCADE" json:"server"`

	Messages       []Message       `json:"messages"`
	DirectMessages []DirectMessage `json:"direct_messages"`

	ConversationsInitiated []Conversation `gorm:"foreignKey:MemberOneID" json:"conversations_initiated"`
	ConversationsReceived  []Conversation `gorm:"foreignKey:MemberTwoID" json:"conversations_received"`

	CreatedAt time.Time `ts_type:"string" json:"created_at"`
	UpdatedAt time.Time `ts_type:"string" json:"updated_at"`
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
	ID   uuid.UUID   `gorm:"type:uuid;default:gen_random_uuid();primaryKey;" ts_type:"string" json:"id"`
	Name string      `json:"name"`
	Type ChannelType `gorm:"default:TEXT" json:"type"`

	ProfileID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"profile_id"`
	Profile   Profile   `gorm:"foreignKey:ProfileID;references:ID;onDelete:CASCADE" json:"profile"`

	ServerID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"server_id"`
	Server   Server    `gorm:"foreignKey:ServerID;references:ID;onDelete:CASCADE" json:"server"`

	Messages []Message `json:"messages"`

	CreatedAt time.Time `ts_type:"string" json:"created_at"`
	UpdatedAt time.Time `ts_type:"string" json:"updated_at"`
}

type Message struct {
	ID      uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string" json:"id"`
	Content string    `gorm:"type:text" json:"content"`

	FileURL string `gorm:"type:text" json:"file_url"`

	MemberID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"member_id"`
	Member   Member    `gorm:"foreignKey:MemberID;references:ID;onDelete:CASCADE" json:"member"`

	ChannelID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"channel_id"`
	Channel   Channel   `gorm:"foreignKey:ChannelID;references:ID;onDelete:CASCADE" json:"channel"`

	Deleted bool `gorm:"default:false" json:"deleted"`

	CreatedAt time.Time `ts_type:"string" json:"created_at"`
	UpdatedAt time.Time `ts_type:"string" json:"updated_at"`
}

type Conversation struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string" json:"id"`

	MemberOneID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"member_one_id"`
	MemberOne   Member    `gorm:"foreignKey:MemberOneID;references:ID;onDelete:CASCADE" json:"member_one"`

	MemberTwoID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"member_two_id"`
	MemberTwo   Member    `gorm:"foreignKey:MemberTwoID;references:ID;onDelete:CASCADE" json:"member_two"`

	DirectMessages []DirectMessage `json:"direct_messages"`

	CreatedAt time.Time `ts_type:"string" json:"created_at"`
	UpdatedAt time.Time `ts_type:"string" json:"updated_at"`
}

type DirectMessage struct {
	ID      uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" ts_type:"string" json:"id"`
	Content string    `gorm:"type:text" json:"content"`
	FileURL string    `gorm:"type:text" json:"file_url"`

	MemberID uuid.UUID `gorm:"type:uuid" ts_type:"string" json:"member_id"`
	Member   Member    `gorm:"foreignKey:MemberID;references:ID;onDelete:CASCADE" json:"member"`

	ConversationID uuid.UUID    `gorm:"type:uuid" ts_type:"string" json:"conversation_id"`
	Conversation   Conversation `gorm:"foreignKey:ConversationID;references:ID;onDelete:CASCADE" json:"conversation"`

	Deleted bool `gorm:"default:false" json:"deleted"`

	CreatedAt time.Time `ts_type:"string" json:"created_at"`
	UpdatedAt time.Time `ts_type:"string" json:"updated_at"`
}
