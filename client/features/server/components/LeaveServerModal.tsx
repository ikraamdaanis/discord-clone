"use client";

import { Server } from "@prisma/client";
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
import { useState } from "react";

type LeaveServerModalProps = {
  server: Server;
  isOpen: boolean;
  onClose: () => void;
};

/** Confirmation modal for a member leaving a server. */
export const LeaveServerModal = ({
  server,
  isOpen,
  onClose
}: LeaveServerModalProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="flex flex-col gap-0 overflow-hidden rounded-sm bg-backgroundDark p-0 text-black md:rounded-sm"
        closeClassName="text-zinc-400 h-6 w-6"
      >
        <DialogHeader className="p-4">
          <DialogTitle className="mb-2 text-left text-xl font-semibold text-zinc-100">
            Leave &#39;{server?.name}&#39;
          </DialogTitle>
          <DialogDescription className="text-left text-base text-zinc-300">
            Are you sure you want to leave{" "}
            <span className="font-semibold">{server?.name}</span>? You won&#39;t
            be able to re-join this server unless you are re-invited.
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
              variant="primary"
              className="rounded-sm"
            >
              Leave Server
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
