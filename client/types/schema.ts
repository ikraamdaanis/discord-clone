/* Do not change, this code is generated from Golang structs */


export enum MemberRole {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    GUEST = "GUEST",
}
export enum ChannelType {
    TEXT = "TEXT",
    AUDIO = "AUDIO",
    VIDEO = "VIDEO",
}
export interface Conversation {
    ID: string;
    MemberOneID: string;
    MemberOne: Member;
    MemberTwoID: string;
    MemberTwo: Member;
    DirectMessages: DirectMessage[];
    CreatedAt: string;
    UpdatedAt: string;
}
export interface DirectMessage {
    ID: string;
    Content: string;
    FileURL: string;
    MemberID: string;
    Member: Member;
    ConversationID: string;
    Conversation: Conversation;
    Deleted: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}
export interface Channel {
    ID: string;
    Name: string;
    Type: ChannelType;
    ProfileID: string;
    Profile: Profile;
    ServerID: string;
    Server: Server;
    Messages: Message[];
    CreatedAt: string;
    UpdatedAt: string;
}
export interface Message {
    ID: string;
    Content: string;
    FileURL: string;
    MemberID: string;
    Member: Member;
    ChannelID: string;
    Channel: Channel;
    Deleted: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}
export interface Member {
    ID: string;
    Role: MemberRole;
    ProfileID: string;
    Profile: Profile;
    ServerID: string;
    Server: Server;
    Messages: Message[];
    DirectMessages: DirectMessage[];
    ConversationsInitiated: Conversation[];
    ConversationsReceived: Conversation[];
    CreatedAt: string;
    UpdatedAt: string;
}
export interface Server {
    ID: string;
    Name: string;
    ImageURL: string;
    InviteCode: string;
    ProfileID: string;
    Profile: Profile;
    Members: Member[];
    Channels: Channel[];
    CreatedAt: string;
    UpdatedAt: string;
}
export interface Profile {
    id: string;
    user_id: string;
    name: string;
    image_url: string;
    email: string;
    servers: Server[];
    members: Member[];
    channels: Channel[];
    created_at: string;
    updated_at: string;
}





