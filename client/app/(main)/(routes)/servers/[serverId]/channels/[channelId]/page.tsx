import { redirectToSignIn } from "@clerk/nextjs";
import { ChatHeader } from "components/chat/chat-header";
import { ChatInput } from "components/chat/chat-input";
import { ChatMessages } from "components/chat/chat-messages";
import { currentProfile } from "lib/current-profile";
import { db } from "lib/db";
import { redirect } from "next/navigation";

type ChannelPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params?.channelId
    }
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    }
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId
        }}
        paramKey="channelId"
        paramValue={channel.id}
      />
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: params.serverId
        }}
      />
    </div>
  );
};

export default ChannelPage;
