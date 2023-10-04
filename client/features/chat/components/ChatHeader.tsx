import { SidebarToggle } from "components/SidebarToggle";
import { HashIcon } from "components/icons/HashIcon";
import { CallButton } from "features/chat/components/CallButton";
import { SocketIndicator } from "features/chat/components/SocketIndicator";
import { MessageType } from "features/chat/types";
import { UserAvatar } from "features/profile/components/ProfileAvatar";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: MessageType;
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
    <div className="text-md fixed bottom-0 top-0 z-10 flex h-12 min-h-[48px] w-full flex-1 items-center border-b-2 border-neutral-800 bg-backgroundDark px-3 font-semibold md:w-[calc(100%-312px)]">
      <SidebarToggle serverId={serverId} />
      {type === "channel" && (
        <HashIcon
          className="mr-2 h-5 w-5 text-zinc-400"
          showLock={name === "general"}
        />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="mr-2 h-8 w-8 md:h-8 md:w-8" />
      )}
      <p className="text-md font-semibold text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && <CallButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};
