import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "components/providers/socket-provider";
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
};

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    console.log("hi", addKey);

    socket.addEventListener("message", e => {
      // Data sent will be a string so parse into an object
      const event: SocketAddMessage = JSON.parse(e.data);

      console.log("DATA: ", event);

      // Server sets a type for each message
      switch (event.key) {
        case addKey:
          console.log("ADD KEY: ", addKey, event.data);
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
      }
    });

    // socket.on(addKey, (message: MessageWithMemberWithProfile) => {
    //   queryClient.setQueryData([queryKey], (oldData: QueryData | undefined) => {
    //     if (!oldData || !oldData?.pages?.length) {
    //       return {
    //         ...oldData,
    //         pageParams: [],
    //         pages: [
    //           {
    //             items: [message],
    //             cursor: null
    //           }
    //         ]
    //       };
    //     }

    //     const newData = [...oldData.pages];

    //     newData[0] = {
    //       ...newData[0],
    //       items: [message, ...newData[0].items],
    //       cursor: null
    //     };

    //     return {
    //       ...oldData,
    //       pages: newData
    //     };
    //   });
    // });

    // socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
    //   queryClient.setQueriesData(
    //     [queryKey],
    //     (oldData: QueryData | undefined) => {
    //       if (!oldData || !oldData?.pages?.length) {
    //         return oldData;
    //       }

    //       const newData = oldData.pages.map(page => {
    //         return {
    //           ...page,
    //           items: page.items.map((item: MessageWithMemberWithProfile) => {
    //             if (item.id === message.id) {
    //               return message;
    //             }

    //             return item;
    //           })
    //         };
    //       });

    //       return {
    //         ...oldData,
    //         pages: newData
    //       };
    //     }
    //   );
    // });

    // return () => {
    //   socket.off(addKey);
    //   socket.off(updateKey);
    // };
  }, [addKey, queryClient, queryKey, socket, updateKey]);
};
