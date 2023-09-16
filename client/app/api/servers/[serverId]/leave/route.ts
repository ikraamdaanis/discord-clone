import { currentProfile } from "lib/current-profile";
import { db } from "lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  _: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id
        },
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER ID LEAVE]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
