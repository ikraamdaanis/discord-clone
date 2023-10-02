export type UpdateMessagePayload = {
  key: string;
  serverId: string;
  channelId: string;
  content?: string;
  messageId: string;
  deleted?: boolean;
};
