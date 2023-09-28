import { Hash } from "lucide-react";

type ChatWelcomeProps = {
  name: string;
  type: "channel" | "conversation";
};

export const ChatBeginning = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 p-4 pt-8">
      {type === "channel" && (
        <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl font-bold md:text-3xl">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}`}
      </p>
    </div>
  );
};
