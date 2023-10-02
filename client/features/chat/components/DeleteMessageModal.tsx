"use client";

import { useSocket } from "components/providers/socket-provider";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import { UpdateMessagePayload } from "features/chat/types";
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
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Are you sure you want to delete this message?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              disabled={isLoading}
              variant="link"
              className="text-zinc-800"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => handleClick()}
              className="bg-red-500 text-white hover:bg-red-500/90"
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
