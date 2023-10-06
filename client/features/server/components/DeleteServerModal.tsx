"use client";

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
import { useModal } from "hooks/useModal";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Confirmation modal for deleting a server. */
export const DeleteServerModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteServer";

  async function handleClick() {
    try {
      setIsLoading(true);

      await axios.delete(`/api/servers/${server?.id}`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[440px] overflow-hidden rounded-sm bg-backgroundDark p-0"
        closeClassName="text-zinc-400 h-6 w-6"
      >
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="mb-2 text-left text-xl font-semibold text-zinc-100">
            Delete `{server?.name}`
          </DialogTitle>
          <DialogDescription className="mx-auto text-base text-zinc-300">
            <div className="rounded-md bg-[#F0B132] p-2.5 text-left leading-5 text-white">
              Are you sure you want to delete{" "}
              <span className="font-medium">{server?.name}</span>? This action
              cannot be undone.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-backgroundDark3 p-4">
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
              Delete Server
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
