import { MemberRole, Profile } from "@prisma/client";
import { db } from "./db";

export type AddMessagePayload = {
  key: string;
  serverId: string;
  channelId: string;
  content: string;
  deleted: boolean;
  messageId: string;
};

export async function updateMessage(
  args: AddMessagePayload & {
    profile: Profile;
  }
) {
  try {
    const { serverId, channelId, content, key, profile, messageId, deleted } =
      args;

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

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string
      }
    });

    if (!channel) {
      console.error("Channel doesn't exist.");
      return null;
    }

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
    console.error("Message update: ", error);
    return null;
  }
}
