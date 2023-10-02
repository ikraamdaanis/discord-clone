import { MemberRole, Profile } from "@prisma/client";
import { db } from "../../utils/db";

export type UpdateDirectMessagePayload = {
  key: string;
  serverId: string;
  conversationId: string;
  content: string;
  directMessageId: string;
  fileUrl: string;
  deleted: boolean;
};

/** Creates a message in a server channel. */
export async function updateDirectMessage(
  args: UpdateDirectMessagePayload & {
    profile: Profile;
  }
) {
  try {
    const {
      conversationId,
      content,
      profile,
      fileUrl,
      directMessageId,
      deleted
    } = args;

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

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!directMessage || directMessage.deleted) {
      console.error("Message not found.");
      return null;
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const canModify = isMessageOwner;

    if (!canModify) {
      console.error("Cannot update message");
      return null;
    }

    directMessage = await db.directMessage.update({
      where: {
        id: directMessageId as string
      },
      data: {
        content,
        fileUrl,
        ...(deleted && {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true
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

    return directMessage;
  } catch (error) {
    console.error("Error creating a channel message: ", error);
    return null;
  }
}
