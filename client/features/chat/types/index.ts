import { Member, Message, Profile } from "@prisma/client";

export type UpdateMessagePayload = {
  key: string;
  serverId: string;
  channelId: string;
  content?: string;
  messageId: string;
  directMessageId: string;
  deleted?: boolean;
};

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export type MessagesQuery = {
  pageParams: string[];
  pages: {
    items: MessageWithMemberWithProfile[];
    nextCursor: string;
  }[];
};
