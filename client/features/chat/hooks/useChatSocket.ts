import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "components/providers/socket-provider";
import { useUsers } from "hooks/useUsers";
import { useEffect } from "react";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

type QueryData = {
  pageParams: string[];
  pages: { items: MessageWithMemberWithProfile[]; cursor: null }[];
};

type SocketAddMessage = {
  key: string;
  data: MessageWithMemberWithProfile;
  users: string[];
};

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

/**
 * Subscribes to a websocket to listen to message creations and updates
 * in a channel or a direct conversation.
 */
export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const setUsers = useUsers(state => state.setUsers);

  useEffect(() => {
    if (!socket) return;
    console.log("hi");

    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ key: addKey }));
      socket.send(JSON.stringify({ key: updateKey }));
    });

    socket.addEventListener("message", e => {
      // Data sent will be a string so parse into an object
      const event: SocketAddMessage = JSON.parse(e.data);

      // Server sets a type for each message
      switch (event.key) {
        case addKey:
          queryClient.setQueryData(
            [queryKey],
            (oldData: QueryData | undefined) => {
              if (!oldData || !oldData?.pages?.length) {
                return {
                  ...oldData,
                  pageParams: [],
                  pages: [
                    {
                      items: [event.data],
                      cursor: null
                    }
                  ]
                };
              }

              const newData = [...oldData.pages];

              newData[0] = {
                ...newData[0],
                items: [event.data, ...newData[0].items],
                cursor: null
              };

              return {
                ...oldData,
                pages: newData
              };
            }
          );

          break;
        case updateKey:
          queryClient.setQueriesData(
            [queryKey],
            (oldData: QueryData | undefined) => {
              if (!oldData || !oldData?.pages?.length) {
                return oldData;
              }

              const newData = oldData.pages.map(page => {
                return {
                  ...page,
                  items: page.items.map(
                    (item: MessageWithMemberWithProfile) => {
                      if (item.id === event.data.id) {
                        return event.data;
                      }

                      return item;
                    }
                  )
                };
              });

              return {
                ...oldData,
                pages: newData
              };
            }
          );
          break;
        case "users":
          setUsers(event.users);
          break;
      }
    });

    return () => {
      socket.close();
    };
  }, [addKey, queryClient, queryKey, setUsers, socket, updateKey]);
};
