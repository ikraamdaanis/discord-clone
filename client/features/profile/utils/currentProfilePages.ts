import { getAuth } from "@clerk/nextjs/server";
import { Profile } from "@prisma/client";
import { db } from "lib/db";
import { NextApiRequest } from "next";

/**
 * Retrieves the current signed-in user using the Clerk user ID
 * to fetch the profile from the database in pages API routes.
 */
export async function currentProfilePages(
  req: NextApiRequest
): Promise<Profile | null> {
  const { userId } = getAuth(req);

  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  });

  return profile;
}
