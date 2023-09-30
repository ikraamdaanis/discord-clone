import { redirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "features/profile/utils/currentProfile";
import { ServerSidebar } from "features/server/components/ServerSidebar";
import { db } from "lib/db";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const ServerLayout = async ({
  children,
  params
}: {
  children: ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 h-full w-60 flex-col max-md:hidden md:flex">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerLayout;
