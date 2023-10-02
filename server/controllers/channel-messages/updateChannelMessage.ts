import { MemberRole, Profile } from "@prisma/client";
import { db } from "../../utils/db";

export type UpdateChannelMessagePayload = {
  key: string;
  serverId: string;
  channelId: string;
  content: string;
  deleted: boolean;
  messageId: string;
};

/** Updates a message in a server channel. */
export async function updateChannelMessage(
  args: UpdateChannelMessagePayload & {
    profile: Profile;
  }
) {
  try {
    const { serverId, channelId, content, profile, messageId, deleted } = args;

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id
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

    if (!member) {
      console.error("Member doesn't exist.");
      return null;
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!message || message?.deleted) {
      console.error("Message doesn't exist.");
      return null;
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      console.error("User cannot modify message.");
      return null;
    }

    if (content && !isMessageOwner) {
      console.error("User cannot modify message.");
      return null;
    }

    message = await db.message.update({
      where: {
        id: messageId as string
      },
      data: {
        content,
        ...(deleted && {
          deleted,
          fileUrl: null,
          content: "This message has been deleted."
        })
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
    console.error("Error updating a channel message: ", error);
    return null;
  }
}
