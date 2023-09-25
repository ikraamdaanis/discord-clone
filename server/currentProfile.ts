import { db } from "./db";

export async function currentProfile(profileId: string) {
  if (!profileId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      id: profileId
    }
  });

  return profile;
}
