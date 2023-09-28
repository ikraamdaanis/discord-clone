import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

type ChatQueryProps = {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

/** Query to fetch messages from a channel or direct messages. */
export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  async function fetchMessages({ pageParam = undefined }) {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue
        }
      },
      { skipNull: true }
    );

    const res = await fetch(url);

    return res.json();
  }

  return useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: lastPage => lastPage?.nextCursor || false
  });
};
