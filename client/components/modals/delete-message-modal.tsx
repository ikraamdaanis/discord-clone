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
import { useModal } from "hooks/use-modal-store";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

export const DeleteMessageModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteMessage";

  async function handleClick() {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      });

      await axios.delete(url);

      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
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
              onClick={() => onClose()}
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
