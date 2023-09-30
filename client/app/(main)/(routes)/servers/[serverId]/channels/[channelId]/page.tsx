import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { ChatHeader } from "features/chat/components/ChatHeader";
import { ChatInput } from "features/chat/components/ChatInput";
import { ChatMessages } from "features/chat/components/ChatMessages";
import { MediaKitRoom } from "features/chat/components/MediaKitRoom";
import { currentProfile } from "features/profile/utils/currentProfile";
import { db } from "lib/db";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type ChannelPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

export async function generateMetadata({
  params
}: ChannelPageProps): Promise<Metadata> {
  const channel = await db.channel.findUnique({
    where: {
      id: params?.channelId
    },
    include: {
      server: true
    }
  });

  return {
    title: `Discourse | #${channel?.name} | ${channel?.server.name}`
  };
}

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
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            channelId={channel.id}
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
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaKitRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaKitRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelPage;
