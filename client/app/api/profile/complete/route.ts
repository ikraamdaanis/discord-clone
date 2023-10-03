import { currentProfile } from "features/profile/utils/currentProfile";
import { db } from "lib/db";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";

export async function PATCH(req: NextRequest) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    const updatedProfile = await db.profile.update({
      where: {
        id: profile.id
      },
      data: {
        name,
        profileComplete: true
      }
    });

    await clerkClient.users.updateUser(profile.userId, { firstName: name });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Profile complete error: ", error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}
