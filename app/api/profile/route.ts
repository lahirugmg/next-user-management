import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const data = await req.json();
  const allowed = ["firstName", "lastName", "displayName", "bio", "location", "website", "phone"];
  const update: Record<string, any> = {};
  for (const key of allowed) if (key in data) update[key] = data[key];
  try {
    const user = await prisma.user.update({ where: { id: (session.user as any).id }, data: update });
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    return new NextResponse("Failed to update profile", { status: 500 });
  }
}