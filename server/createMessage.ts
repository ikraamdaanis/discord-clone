import { Profile } from "@prisma/client";
import { db } from "./db";

export type AddMessagePayload = {
  key: string;
  serverId: string;
  channelId: string;
  content: string;
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

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string
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
    console.error("MESSAGES_POST: ", error);
    return null;
  }
}
