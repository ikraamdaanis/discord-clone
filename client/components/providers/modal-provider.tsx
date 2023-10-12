"use client";

import { DeleteChannelModal } from "components/modals/delete-channel-modal";
import { EditChannelModal } from "components/modals/edit-channel-modal";
import { MessageFileModal } from "components/modals/message-file-modal";
import { CreateChannelModal } from "features/server/components/CreateChannelModal";
import { DeleteServerModal } from "features/server/components/DeleteServerModal";
import { InviteModal } from "features/server/components/InviteModal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <DeleteServerModal />
      <CreateChannelModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <InviteModal />
      <MessageFileModal />
    </>
  );
};
