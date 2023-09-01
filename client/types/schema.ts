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
    id: string;
    member_one_id: string;
    member_one: Member;
    member_two_id: string;
    member_two: Member;
    direct_messages: DirectMessage[];
    created_at: string;
    updated_at: string;
}
export interface DirectMessage {
    id: string;
    content: string;
    file_url: string;
    member_id: string;
    member: Member;
    conversation_id: string;
    conversation: Conversation;
    deleted: boolean;
    created_at: string;
    updated_at: string;
}
export interface Channel {
    id: string;
    name: string;
    type: ChannelType;
    profile_id: string;
    profile: Profile;
    server_id: string;
    server: Server;
    messages: Message[];
    created_at: string;
    updated_at: string;
}
export interface Message {
    id: string;
    content: string;
    file_url: string;
    member_id: string;
    member: Member;
    channel_id: string;
    channel: Channel;
    deleted: boolean;
    created_at: string;
    updated_at: string;
}
export interface Member {
    id: string;
    role: MemberRole;
    profile_id: string;
    profile: Profile;
    server_id: string;
    server: Server;
    messages: Message[];
    direct_messages: DirectMessage[];
    conversations_initiated: Conversation[];
    conversations_received: Conversation[];
    created_at: string;
    updated_at: string;
}
export interface Server {
    id: string;
    name: string;
    image_url: string;
    invite_code: string;
    profile_id: string;
    profile: Profile;
    members: Member[];
    channels: Channel[];
    created_at: string;
    updated_at: string;
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





