"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EmojiPicker } from "components/emoji-picker";
import { useSocket } from "components/providers/socket-provider";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Input } from "components/ui/input";
import { useModal } from "hooks/use-modal-store";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type AddMessagePayload = {
  key: string;
  serverId: string;
  channelId: string;
  content: string;
};

type ChatInputProps = {
  apiUrl: string;
  query: Record<string, string>;
  name: string;
  type: "conversation" | "channel";
};

const formSchema = z.object({
  content: z.string().min(1)
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const { socket } = useSocket();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload: AddMessagePayload = {
        key: `chat:${query.channelId}:messages`,
        serverId: query.serverId,
        channelId: query.channelId,
        content: values.content
      };

      socket?.send(JSON.stringify(payload));

      form.reset();

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                    ref={inputRef}
                    autoFocus
                  />
                  <div className="absolute right-8 top-7">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value}${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
