import { SidebarToggle } from "components/SidebarToggle";
import { HashIcon } from "components/icons/HashIcon";
import { SocketIndicator } from "features/chat/components/SocketIndicator";
import { VideoChatButton } from "features/chat/components/VideoChatButton";
import { UserAvatar } from "features/profile/components/ProfileAvatar";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
};

/** Header for channels and direct messages. */
export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl
}: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 min-h-[48px] items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <SidebarToggle serverId={serverId} />
      {type === "channel" && (
        <HashIcon
          className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400"
          showLock={name === "general"}
        />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="mr-2 h-8 w-8 md:h-8 md:w-8" />
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && <VideoChatButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};
