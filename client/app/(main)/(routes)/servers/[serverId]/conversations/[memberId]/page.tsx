import { redirectToSignIn } from "@clerk/nextjs";
import { ChatHeader } from "components/chat/chat-header";
import { ChatInput } from "components/chat/chat-input";
import { ChatMessages } from "components/chat/chat-messages";
import { getOrCreateConversation } from "lib/conversation";
import { currentProfile } from "lib/current-profile";
import { db } from "lib/db";
import { redirect } from "next/navigation";

type MemberPageProps = {
  params: {
    memberId: string;
    serverId: string;
  };
};

const MemberPage = async ({ params }: MemberPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
      <ChatMessages
        member={currentMember}
        name={otherMember.profile.name}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/api/direct-messages"
        paramKey="conversationId"
        paramValue={conversation.id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id
        }}
      />
      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id
        }}
      />
    </div>
  );
};

export default MemberPage;