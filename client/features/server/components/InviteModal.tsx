"use client";

import axios from "axios";
import { Button } from "components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useModal } from "hooks/useModal";
import { useOrigin } from "hooks/useOrigin";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

/** Modal that displays an invite link to the server. */
export const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();

  const origin = useOrigin();
  const inviteUrl = `${origin}/invite/${data?.server?.inviteCode}`;

  const isModalOpen = isOpen && type === "invite";

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function onCopy() {
    navigator.clipboard.writeText(inviteUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  async function onNew() {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `/api/servers/${data?.server?.id}/invite-code`
      );

      onOpen("invite", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-backgroundDark flex flex-col gap-0 overflow-hidden rounded-sm p-0 text-black md:rounded-sm"
        closeClassName="text-zinc-400 h-6 w-6"
      >
        <DialogTitle className="text-md p-4 text-left font-medium text-zinc-100">
          Invite Friends to {data.server?.name}
        </DialogTitle>
        <div className="p-4">
          <Label className="text-xs font-bold uppercase text-zinc-300">
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              className="bg-backgroundDark2 border-0 text-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={isLoading}
              readOnly
            />
            <Button
              size="icon"
              onClick={onCopy}
              disabled={isLoading}
              className="bg-brandColour hover:bg-brandColour/80 text-zinc-100"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="mt-4 px-0 text-xs text-zinc-200"
            disabled={isLoading}
            onClick={onNew}
          >
            Generate a new link
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
