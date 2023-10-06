"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChannelType } from "@prisma/client";
import axios from "axios";
import { HashIcon } from "components/icons/HashIcon";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "components/ui/form";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { useModal } from "hooks/useModal";
import { Mic } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";
import { useForm } from "react-hook-form";
import * as z from "zod";

const channelTypeMap = {
  [ChannelType.TEXT]: {
    icon: <HashIcon className="mr-2 h-6 w-6 text-zinc-300" />,
    message: "Send messages, images, GIFs, emoji, opinions and puns"
  },
  [ChannelType.AUDIO]: {
    icon: <Mic className="mr-2 h-6 w-6 text-zinc-300" />,
    message: "Hang out together with voice, video and screen share"
  }
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is required."
    })
    .refine(name => name.trim().toLowerCase() !== "general", {
      message: "Channel name cannot be 'general'."
    }),
  type: z.nativeEnum(ChannelType)
});

export const CreateChannelModal = () => {
  const router = useRouter();
  const params = useParams();

  const { isOpen, onClose, type, data } = useModal();
  const { channelType } = data;

  const isModalOpen = isOpen && type === "createChannel";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT
    },
    values: {
      name: "",
      type: channelType || ChannelType.TEXT
    }
  });

  const isLoading = form.formState.isSubmitting;

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params?.serverId
        }
      });
      await axios.post(url, values);

      handleClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      form.reset();
    }
  }

  function handleClose() {
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[460px] overflow-hidden rounded-sm bg-backgroundDark p-0">
        <DialogHeader className="px-4 pt-6">
          <DialogTitle className="text-center text-2xl font-semibold">
            Create a Channel
          </DialogTitle>
          <DialogDescription className="text-base text-zinc-400">
            Your server is where you and your friends hang out. Make yours and
            start talking.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="space-y-2 px-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-zinc-200">
                        Channel Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            disabled={isLoading}
                            className="border-0 bg-backgroundDark2 pl-8 text-base text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Enter channel name"
                            {...field}
                          />
                          <div className="absolute left-2 top-1/2 -translate-y-1/2">
                            <HashIcon className="h-4 w-4" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-zinc-200">
                        Channel Type
                      </FormLabel>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {Object.values(ChannelType).map(type => {
                          return (
                            <Label
                              htmlFor={type}
                              className="flex cursor-pointer items-center space-x-2 rounded-sm bg-backgroundDark4 px-3 py-2.5"
                              key={type}
                            >
                              <div>{channelTypeMap[type].icon}</div>
                              <div className="flex flex-1 flex-col">
                                <p className="text-base">
                                  {type.charAt(0).toUpperCase() +
                                    type.slice(1).toLowerCase()}
                                </p>
                                <p className="text-zinc-400">
                                  {channelTypeMap[type].message}
                                </p>
                              </div>
                              <div className="flex w-6 items-center justify-center">
                                <RadioGroupItem
                                  value={type}
                                  id={type}
                                  className="outline-none ring-0 ring-offset-0"
                                />
                              </div>
                            </Label>
                          );
                        })}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter className="bg-backgroundDark3 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create Channel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
