import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { currentProfile } from "features/profile/utils/currentProfile";

/** Shows user's name and avatar in the sidebar */
export const UserStatusBar = async () => {
  const profile = await currentProfile();

  if (!profile) return null;

  return (
    <div className="flex h-[52px] items-center bg-backgroundDark5 px-2">
      <div className="relative">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            baseTheme: dark,
            elements: {
              avatarBox: "h-8 w-8",
              userButtonPopoverCard: "rounded-md"
            }
          }}
        />
        <div className="absolute -bottom-1 -right-1 h-[16px] w-[16px] rounded-full border-[3px] border-backgroundDark2 bg-green-500" />
      </div>
      <div className="flex flex-col py-1 pl-2">
        <span className="w-[76px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold leading-[18px] text-zinc-200">
          {profile.name}
        </span>
        <span className="w-[76px] overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold text-zinc-400">
          Online
        </span>
      </div>
    </div>
  );
};
