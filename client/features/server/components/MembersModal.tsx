"use client";

import { MemberRole } from "@prisma/client";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "components/ui/dropdown-menu";
import { ScrollArea } from "components/ui/scroll-area";
import { UserAvatar } from "features/profile/components/ProfileAvatar";
import { cn } from "lib/utils";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { ServerWithMembersWithProfiles } from "types";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />
};

type EditServerModalProps = {
  server: ServerWithMembersWithProfiles;
  isOpen: boolean;
  onClose: () => void;
};

/** Modal for managing members in a server. */
export const MembersModal = ({
  server,
  isOpen,
  onClose
}: EditServerModalProps) => {
  const router = useRouter();

  // const { isOpen, onClose, type, data, onOpen } = useModal();

  const [loadingId, setLoadingId] = useState("");

  // const isModalOpen = isOpen && type === "members";

  // const { server } = data as { server: ServerWithMembersWithProfiles };

  async function onRoleChange(memberId: string, role: MemberRole) {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      });

      await axios.patch(url, { role });

      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  }

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      });

      await axios.delete(url);

      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[440px] overflow-hidden rounded-sm bg-backgroundDark p-0"
        closeClassName="text-zinc-400 h-6 w-6"
      >
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-center text-2xl font-semibold text-zinc-100">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-balance mx-auto text-center text-base text-zinc-300">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="p-4">
          <div className="flex flex-col gap-4">
            {server?.members?.map(member => {
              return (
                <div key={member.id} className="flex items-center gap-x-2">
                  <UserAvatar src={member.profile.imageUrl} />
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-1 text-xs font-semibold">
                      {member.profile.name}
                      {roleIconMap[member.role]}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {member.profile.email}
                    </p>
                  </div>
                  {server.profileId !== member.profileId &&
                    loadingId !== member.profileId && (
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={cn(
                              loadingId === member.id && "pointer-events-none"
                            )}
                          >
                            {loadingId === member.id ? (
                              <Loader2
                                className="ml-auto h-4 w-4 animate-spin text-zinc-500"
                                focusable="false"
                              />
                            ) : (
                              <MoreVertical
                                className="h-4 w-4 text-zinc-500"
                                focusable="false"
                              />
                            )}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center">
                                <ShieldQuestion className="mr-2 h-4 w-4" />
                                <span>Role</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      onRoleChange(member.id, "GUEST");
                                    }}
                                  >
                                    <User className="mr-2 h-4 w-4" />
                                    Guest
                                    {member.role === "GUEST" && (
                                      <Check className="ml-auto h-4 w-4" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center"
                                    onClick={() => {
                                      onRoleChange(member.id, "MODERATOR");
                                    }}
                                  >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Moderator
                                    {member.role === "MODERATOR" && (
                                      <Check className="ml-1 h-4 w-4" />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                onKick(member.id);
                              }}
                            >
                              <Gavel className="mr-2 h-4 w-4" /> Kick
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
