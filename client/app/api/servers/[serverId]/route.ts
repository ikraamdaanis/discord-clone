import { currentProfile } from "features/profile/utils/currentProfile";
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

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER UPDATE]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER DELETE]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
