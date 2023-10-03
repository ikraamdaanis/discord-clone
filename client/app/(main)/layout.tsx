import { NavigationSidebar } from "components/navigation/NavigationSidebar";
import { SocketProvider } from "components/providers/socket-provider";
import { currentProfile } from "features/profile/utils/currentProfile";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const profile = await currentProfile();

  if (!profile?.profileComplete) {
    return redirect("/complete-profile");
  }

  return (
    <SocketProvider profileId={profile?.id || ""}>
      <div className="h-full bg-backgroundDark">
        <div className="fixed inset-y-0 z-30 h-full w-[72px] flex-col max-md:hidden md:flex">
          <NavigationSidebar />
        </div>
        <main className="h-full md:pl-[72px]">{children}</main>
      </div>
    </SocketProvider>
  );
};

export default MainLayout;
