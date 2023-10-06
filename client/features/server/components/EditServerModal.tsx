"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FileUpload } from "features/chat/components/FileUpload";
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
import { useModal } from "hooks/useModal";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required."
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required."
  })
});

/** Form to update the server. */
export const EditServerModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();
  const { server } = data;

  const isModalOpen = isOpen && type === "editServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: ""
    },
    values: {
      name: server?.name || "",
      imageUrl: server?.imageUrl || ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);

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
      <DialogContent
        className="max-w-[440px] overflow-hidden rounded-sm bg-backgroundDark p-0"
        closeClassName="text-zinc-400 h-6 w-6"
      >
        <DialogHeader className="mb-4 px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-semibold text-zinc-100">
            Edit server
          </DialogTitle>
          <DialogDescription className="text-balance mx-auto text-center text-base text-zinc-300">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-zinc-200">
                        Server Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="border-0 bg-backgroundDark2 text-base text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Enter server name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter className="bg-backgroundDark2 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
