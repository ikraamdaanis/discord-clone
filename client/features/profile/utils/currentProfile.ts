import { auth } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import { db } from "lib/db";

/**
 * Retrieves the current signed-in user using the Clerk user ID
 * to fetch the profile from the database in server components.
 */
export async function currentProfile(): Promise<Profile | null> {
  const { userId } = auth();

  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  });

  return profile;
}
