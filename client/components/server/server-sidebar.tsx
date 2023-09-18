import { ChannelType, MemberRole } from "@prisma/client";
import { ServerHeader } from "components/server/server-header";
import { ServerSearch } from "components/server/server-search";
import { ScrollArea } from "components/ui/scroll-area";
import { currentProfile } from "lib/current-profile";
import { db } from "lib/db";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";

type ServerSidebarProps = {
  serverId: string;
};

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  });

  const textChannels =
    server?.channels.filter(channel => channel.type === ChannelType.TEXT) || [];

  const audioChannels =
    server?.channels.filter(channel => channel.type === ChannelType.AUDIO) ||
    [];

  const videoChannels =
    server?.channels.filter(channel => channel.type === ChannelType.VIDEO) ||
    [];

  const members = server?.members.filter(
    member => member.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(member => member.profileId === profile.id)
    ?.role;

  return (
    <div className="fixed inset-y-0 z-20 h-full w-60 flex-col max-md:hidden md:flex">
      <div className="text-primary flex h-full w-full flex-col bg-[#f2f3f5] dark:bg-[#2b2d31]">
        <ServerHeader server={server} role={role} />
        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <ServerSearch
              data={[
                {
                  label: "Text Channels",
                  type: "channel",
                  data: textChannels?.map(channel => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[ChannelType.TEXT]
                  }))
                },
                {
                  label: "Voice Channels",
                  type: "channel",
                  data: audioChannels?.map(channel => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[ChannelType.AUDIO]
                  }))
                },
                {
                  label: "Video Channels",
                  type: "channel",
                  data: videoChannels?.map(channel => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[ChannelType.VIDEO]
                  }))
                },
                {
                  label: "Members",
                  type: "member",
                  data: members?.map(member => ({
                    id: member.id,
                    name: member.profile.name,
                    icon: roleIconMap[member.role]
                  }))
                }
              ]}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
