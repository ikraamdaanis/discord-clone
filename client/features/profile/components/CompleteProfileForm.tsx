"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@prisma/client";
import axios from "axios";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "components/ui/form";
import { Input } from "components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Display name is required."
  })
});

type CompleteProfileFormProps = {
  profile: Profile;
};

export const CompleteProfileForm = ({ profile }: CompleteProfileFormProps) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    },
    values: {
      name: profile.name || ""
    }
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = "/api/profile/complete";

      await axios.patch(url, values);

      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="w-[440px] rounded-sm bg-backgroundDark p-4">
      <h2 className="py-4 text-center text-2xl font-semibold text-zinc-200">
        Complete your profile
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-zinc-200">
                    Display Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-0 bg-backgroundDark2 text-base text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Enter channel name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button
            variant="primary"
            disabled={isLoading}
            className="w-full rounded-sm p-4 text-base"
            size="lg"
          >
            Complete Profile
          </Button>
        </form>
      </Form>
    </div>
  );
};
