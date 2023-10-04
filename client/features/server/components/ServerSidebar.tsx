import { ChannelType, MemberRole } from "@prisma/client";
import { ScrollArea } from "components/ui/scroll-area";
import { Separator } from "components/ui/separator";
import { currentProfile } from "features/profile/utils/currentProfile";
import { ServerChannel } from "features/server/components/ServerChannel";
import { ServerMember } from "features/server/components/ServerMember";
import { ServerSearch } from "features/server/components/ServerSearch";
import { SidebarHeader } from "features/server/components/SidebarHeader";
import { SidebarSection } from "features/server/components/SidebarSection";
import { db } from "lib/db";
import { Hash, Mic, ShieldAlert, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

type ServerSidebarProps = {
  serverId: string;
};

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
};

/** Sidebar for the servers. Displays a list of the server's channels. */
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

  const members = server?.members.filter(
    member => member.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(member => member.profileId === profile.id)
    ?.role;

  return (
    <div className="flex h-full w-full flex-col bg-backgroundDark3 text-primary">
      <SidebarHeader server={server} role={role} />
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
        <Separator className="my-2 rounded-md bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <SidebarSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <SidebarSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <SidebarSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map(member => (
                <ServerMember key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
