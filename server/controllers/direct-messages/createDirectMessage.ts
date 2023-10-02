import { Profile } from "@prisma/client";
import { db } from "../../utils/db";

export type AddDirectMessagePayload = {
  key: string;
  serverId: string;
  conversationId: string;
  content: string;
  messageId: string;
  fileUrl: string;
};

/** Creates a message in a server channel. */
export async function createDirectMessage(
  args: AddDirectMessagePayload & {
    profile: Profile;
  }
) {
  try {
    const { conversationId, content, profile, fileUrl } = args;

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id
            }
          },
          {
            memberTwo: {
              profileId: profile.id
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!conversation) {
      console.error("Conversation doesn't exist");
      return null;
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      console.error("Member doesn't exist");
      return null;
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id
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
