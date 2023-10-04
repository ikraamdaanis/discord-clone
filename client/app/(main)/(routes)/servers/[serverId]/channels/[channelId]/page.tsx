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
    <div className="relative flex h-full max-h-screen flex-col overflow-hidden bg-backgroundDark">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <div className="h-[76px]" />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            channelId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            paramKey="channelId"
            paramValue={channel.id}
            socketKey={`chat:${channel.id}`}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            socketKey={`chat:${channel.id}`}
            query={{
              channelId: channel.id,
              serverId: params.serverId
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaKitRoom chatId={channel.id} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaKitRoom chatId={channel.id} audio={true} />
      )}
    </div>
  );
};

export default ChannelPage;
