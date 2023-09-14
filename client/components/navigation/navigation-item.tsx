"use client";

import Image from "next/image";
import { cn } from "lib/utils";
import { ActionTooltip } from "components/action-tooltip";
import { useParams, useRouter } from "next/navigation";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={handleClick}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "bg-primary absolute left-0 h-0 w-[4px] rounded-r-full transition-all",
            params?.serverId !== id && "group-hover:h-4",
            params?.serverId === id && "h-12"
          )}
        />
        <div
          className={cn(
            "group relative mx-3 flex h-12 w-12 overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt="Channel icon" />
        </div>
      </button>
    </ActionTooltip>
  );
};
