"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "features/profile/components/ProfileAvatar";
import { useUsers } from "hooks/useUsers";
import { cn } from "lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface ServerMemberProps {
  member: Member & { profile: Profile };
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />
};

/** Displays a member's name and avatar and links to the conversation page. */
export const ServerMember = ({ member }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const users = useUsers(state => state.users);

  const isOnline = users.find(userId => userId === member.profileId);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/50",
        params?.memberId === member.id && "bg-zinc-700/20",
        !isOnline && "opacity-30"
      )}
    >
      <div className="relative">
        <UserAvatar
          src={member.profile.imageUrl}
          className="h-8 w-8 md:h-8 md:w-8"
        />
        <div
          className={cn(
            "absolute -bottom-1 -right-1 h-[16px] w-[16px] rounded-full border-[3px] border-backgroundDark2 bg-green-500",
            !isOnline && "hidden"
          )}
        />
      </div>
      <p
        className={cn(
          "text-sm font-semibold  text-zinc-400  transition group-hover:text-zinc-300",
          params?.memberId === member.id &&
            "text-zinc-200 group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>

      {icon}
    </button>
  );
};
