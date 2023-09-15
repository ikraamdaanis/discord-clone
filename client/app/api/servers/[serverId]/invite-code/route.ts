import { currentProfile } from "lib/current-profile";
import { db } from "lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
      data: {
        inviteCode: uuid()
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID]: ", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
