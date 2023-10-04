"use client";

import { Member } from "@prisma/client";
import { DiscourseLogo } from "components/DiscourseLogo";
import { InfiniteScroller } from "components/InfiniteScroller";
import dayjs from "dayjs";
import { ChatBeginning } from "features/chat/components/ChatBeginning";
import { useChatQuery } from "features/chat/hooks/useChatQuery";
import { useChatSocket } from "features/chat/hooks/useChatSocket";
import { MessageType, MessageWithMemberWithProfile } from "features/chat/types";
import { cn } from "lib/utils";
import { Loader2, ServerCrash } from "lucide-react";
import { isMobile } from "react-device-detect";
import { ChatMessage } from "./ChatMessage";

interface ChatMessagesProps {
  name: string;
  member: Member;
  channelId: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: MessageType;
  socketKey: string;
}

/** Displays the messages in a channel or direct messages. */
export const ChatMessages = ({
  name,
  member,
  channelId,
  apiUrl,
  paramKey,
  paramValue,
  type,
  socketKey
}: ChatMessagesProps) => {
  const queryKey = socketKey;
  const addKey = `${socketKey}:messages`;
  const updateKey = `${socketKey}:messages:update`;

  const { data, fetchNextPage, hasNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  });

  console.log("DATA: ", data);

  const rows = data?.pages.flatMap(
    page => page?.items || []
  ) as MessageWithMemberWithProfile[];

  useChatSocket({ queryKey, addKey, updateKey });

  if (status == "loading") {
    return (
      <div className="flex h-[calc(100vh-48px-88px)] flex-1 flex-col items-center justify-center">
        <DiscourseLogo className="h-20 w-20 animate-pulse" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-[calc(100vh-48px-88px)] flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-400">Something went wrong!</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[calc(100vh-48px-88px)] flex-col",
        isMobile && "h-[calc(100vh-48px-128px)]"
      )}
    >
      <InfiniteScroller
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage || false}
        loadingMessage={
          <Loader2 className="my-4 h-6 w-6 animate-spin text-zinc-500" />
        }
        endingMessage={<ChatBeginning type={type} name={name} />}
        className="scroller mr-1 flex flex-1 flex-col-reverse overflow-auto"
      >
        {rows.map(message => {
          return (
            <ChatMessage
              key={message.id}
              id={message.id}
              channelId={channelId}
              serverId={member.serverId}
              currentMember={member}
              member={message.member}
              content={message.content}
              fileUrl={message.fileUrl}
              deleted={message.deleted}
              timestamp={dayjs(new Date(message.createdAt)).format(
                "YYYY/MM/DD HH:mm"
              )}
              isUpdated={message.updatedAt !== message.createdAt}
              type={type}
              socketKey={socketKey}
            />
          );
        })}
      </InfiniteScroller>
    </div>
  );
};
