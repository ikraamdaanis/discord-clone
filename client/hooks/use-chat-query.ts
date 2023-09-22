import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "components/providers/socket-provider";
import qs from "query-string";

type ChatQueryProps = {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

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
    getNextPageParam: lastPage => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000
  });
};
