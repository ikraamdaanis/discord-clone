import { currentProfile } from "lib/current-profile";
import { db } from "lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, imageUrl } = await req.json();

    console.log(name);

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
      data: {
        name,
        imageUrl
      }
    });

    console.log(server);

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER UPDATE]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
