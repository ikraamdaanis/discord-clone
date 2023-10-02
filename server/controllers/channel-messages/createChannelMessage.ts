import { Profile } from "@prisma/client";
import { db } from "../../utils/db";

export type AddChannelMessagePayload = {
  key: string;
  serverId: string;
  channelId: string;
  content: string;
  fileUrl: string;
  messageId: string;
};

/** Creates a message in a server channel. */
export async function createChannelMessage(
  args: AddChannelMessagePayload & {
    profile: Profile;
  }
) {
  try {
    const { serverId, channelId, content, profile, fileUrl } = args;

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
        fileUrl,
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
    console.error("Error creating a channel message: ", error);
    return null;
  }
}
