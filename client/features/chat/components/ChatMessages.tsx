"use client";

import { Member, Message, Profile } from "@prisma/client";
import { DiscourseLogo } from "components/DiscourseLogo";
import { InfiniteScroller } from "components/InfiniteScroller";
import { format } from "date-fns";
import { ChatBeginning } from "features/chat/components/ChatBeginning";
import { useChatQuery } from "features/chat/hooks/useChatQuery";
import { useChatSocket } from "features/chat/hooks/useChatSocket";
import { Loader2, ServerCrash } from "lucide-react";
import { ChatMessage } from "./ChatMessage";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  channelId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

/** Displays the messages in a channel or direct messages. */
export const ChatMessages = ({
  name,
  member,
  channelId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type
}: ChatMessagesProps) => {
  const queryKey = `chat:${channelId}`;
  const addKey = `chat:${channelId}:messages`;
  const updateKey = `chat:${channelId}:messages:update`;

  const { data, fetchNextPage, hasNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  });

  const rows = data?.pages.flatMap(
    page => page.items
  ) as MessageWithMemberWithProfile[];

  useChatSocket({ queryKey, addKey, updateKey });

  if (status == "loading") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <DiscourseLogo className="h-20 w-20 animate-pulse" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-48px-88px)] flex-col">
      <InfiniteScroller
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage || false}
        loadingMessage={
          <Loader2 className="my-4 h-6 w-6 animate-spin text-zinc-500" />
        }
        endingMessage={<ChatBeginning type={type} name={name} />}
        className="flex flex-1 flex-col-reverse overflow-auto"
      >
        {rows.map(message => {
          return (
            <ChatMessage
              key={message.id}
              id={message.id}
              currentMember={member}
              member={message.member}
              content={message.content}
              fileUrl={message.fileUrl}
              deleted={message.deleted}
              timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
              isUpdated={message.updatedAt !== message.createdAt}
              socketUrl={socketUrl}
              socketQuery={socketQuery}
            />
          );
        })}
      </InfiniteScroller>
    </div>
  );
};
