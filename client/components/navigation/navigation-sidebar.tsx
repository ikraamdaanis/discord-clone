import { UserButton } from "@clerk/nextjs";
import { NavigationAction } from "components/navigation/navigation-action";
import { NavigationItem } from "components/navigation/navigation-item";
import { ThemeToggle } from "components/theme-toggle";
import { ScrollArea } from "components/ui/scroll-area";
import { Separator } from "components/ui/separator";
import { currentProfile } from "lib/current-profile";
import { db } from "lib/db";
import { redirect } from "next/navigation";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  return (
    <div className="fixed inset-y-0 z-30 h-full w-[72px] flex-col max-md:hidden md:flex">
      <div className="text-primary flex h-full w-full flex-col items-center space-y-4 py-3 dark:bg-[#1e1f22]">
        <ScrollArea>
          <div className="flex w-full flex-col items-center gap-3">
            {servers.map(server => {
              return (
                <div key={server.id}>
                  <NavigationItem
                    id={server.id}
                    name={server.name}
                    imageUrl={server.imageUrl}
                  />
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
        <NavigationAction />
        <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
          <ThemeToggle />
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-12 w-12"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
