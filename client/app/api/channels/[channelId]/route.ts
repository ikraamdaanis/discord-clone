import { MemberRole } from "@prisma/client";
import { currentProfile } from "features/profile/utils/currentProfile";
import { db } from "lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    if (!params.channelId) {
      return new NextResponse("Channel ID missing,", { status: 400 });
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID missing,", { status: 400 });
    }

    const { name, type } = await req.json();

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'.", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general"
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNELS_PATCH: ", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    if (!params.channelId) {
      return new NextResponse("Channel ID missing,", { status: 400 });
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID missing,", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general"
            }
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNELS_DELETE: ", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
