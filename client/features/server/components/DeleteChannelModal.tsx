"use client";

import { Channel, Server } from "@prisma/client";
import axios from "axios";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

type Props = {
  server: Server;
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
};

/** Modal for confirming channel deletion. */
export const DeleteChannelModal = ({
  server,
  channel,
  isOpen,
  onClose
}: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      });

      await axios.delete(url);

      router.refresh();
      router.push(`/servers/${server?.id}`);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[440px] overflow-hidden rounded-sm bg-backgroundDark p-0"
        closeClassName="text-zinc-400 h-6 w-6"
      >
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="mb-2 text-left text-xl font-semibold text-zinc-100">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-left text-base text-zinc-300">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-indigo-500">
              {channel?.name}
            </span>
            ? The channel will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-backgroundDark3 px-6 py-4">
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              disabled={isLoading}
              variant="link"
              className="text-zinc-200"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => handleClick()}
              className="bg-red-500 text-white hover:bg-red-500/90"
            >
              Delete Channel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
