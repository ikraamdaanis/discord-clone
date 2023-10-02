"use client";

import { useQuery } from "@tanstack/react-query";
import { useSocket } from "components/providers/socket-provider";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from "components/ui/dialog";
import dayjs from "dayjs";
import { MessageWithMemberWithProfile } from "features/chat/components/ChatMessages";
import { MessagesQuery, UpdateMessagePayload } from "features/chat/types";
import { UserAvatar } from "features/profile/components/ProfileAvatar";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

type DeleteMessageModalProps = {
  channelId: string;
  serverId: string;
  messageId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  socketKey: string;
};

/** Confirmation modal to delete a message in a channel or conversation. */
export const DeleteMessageModal = ({
  channelId,
  serverId,
  messageId,
  isOpen,
  setIsOpen,
  socketKey
}: DeleteMessageModalProps) => {
  const router = useRouter();

  const { socket } = useSocket();
  const { data } = useQuery<MessagesQuery>({
    queryKey: [socketKey]
  });

  const message = (
    data?.pages.flatMap(page => page.items) as MessageWithMemberWithProfile[]
  ).find(message => message.id === messageId);

  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);

      const payload: UpdateMessagePayload = {
        key: `${socketKey}:messages:update`,
        serverId: serverId || "",
        channelId: channelId || "",
        messageId: messageId || "",
        directMessageId: messageId || "",
        deleted: true
      };

      socket?.send(JSON.stringify(payload));

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden bg-backgroundDark p-0">
        <div className="p-4 pb-0">
          <DialogTitle className="mb-2 text-xl font-semibold text-zinc-200">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-base text-zinc-200">
            Are you sure you want to delete this message?
          </DialogDescription>
        </div>
        {message?.content && (
          <div
            className="mx-4 p-1 py-2.5"
            style={{
              boxShadow:
                "rgba(30, 31, 34, 0.6) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 2px 10px 0px"
            }}
          >
            <div className="flex transition hover:drop-shadow-md">
              <UserAvatar
                src={message?.member?.profile?.imageUrl}
                className="m-2 mr-3"
              />
              <div className="mt-2">
                <h2 className="gap-2 leading-5">
                  <span className="mr-2 font-semibold hover:underline">
                    {message?.member.profile.name}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">
                    {dayjs(message.createdAt).format("YYYY/MM/DD HH:mm")}
                  </span>
                </h2>
                <p className="line-clamp-4 pr-3 text-zinc-300">
                  {message?.content}
                  {message.createdAt !== message.updatedAt && (
                    <span className="mx-1 text-[10px] text-zinc-400">
                      (edited)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="bg-backgroundDark3 px-6 py-4">
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              disabled={isLoading}
              variant="link"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => handleClick()}
              className="w-24 rounded-sm bg-red-500 text-white hover:bg-red-500/70"
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
