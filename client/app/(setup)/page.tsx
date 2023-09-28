import { InitialModal } from "components/modals/initial-modal";
import { initialProfile } from "features/profile/utils/initialProfile";
import { db } from "lib/db";
import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`, RedirectType.push);
  }

  return <InitialModal />;
};

export default SetupPage;
