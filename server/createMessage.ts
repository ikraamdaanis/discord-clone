import { Profile } from "@prisma/client";
import { db } from "./db";

export type AddMessagePayload = {
  key: string;
  serverId: string;
  channelId: string;
  content: string;
  messageId: string;
  deleted: boolean;
};

export async function createMessage(
  args: AddMessagePayload & {
    profile: Profile;
  }
) {
  try {
    const { serverId, channelId, content, key, profile } = args;

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id
          }
        }
      },
      include: {
        members: true
      }
    });

    const member = server?.members.find(
      member => member.profileId === profile.id
    );

    const message = await db.message.create({
      data: {
        content,
        channelId: channelId as string,
        memberId: member?.id as string
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    return message;
  } catch (error) {
    console.error("Message Creation: ", error);
    return null;
  }
}
