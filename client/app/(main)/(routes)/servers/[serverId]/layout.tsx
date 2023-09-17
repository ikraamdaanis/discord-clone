import { redirectToSignIn } from "@clerk/nextjs";
import { ServerSidebar } from "components/server/server-sidebar";
import { currentProfile } from "lib/current-profile";
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
      <ServerSidebar serverId={params.serverId} />
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerLayout;
