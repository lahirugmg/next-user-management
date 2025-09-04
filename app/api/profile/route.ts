import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const allowed = ["firstName", "lastName", "displayName", "bio", "location", "website", "phone"] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    return new NextResponse("Failed to fetch profile", { status: 500 });
  }
}

// Initialize minimal profile data on first login.
// Only fills fields that are currently empty/null to be idempotent.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const data = await req.json();
  try {
    const current = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!current) return new NextResponse("User not found", { status: 404 });

    const patch: Record<string, any> = {};
    for (const key of allowed) {
      if (key in data) {
        const currVal = (current as any)[key];
        const incoming = data[key];
        const isEmpty = currVal === null || currVal === undefined || currVal === "";
        if (isEmpty && typeof incoming === "string" && incoming.trim() !== "") {
          patch[key] = incoming;
        }
      }
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: true, user: current, changed: false });
    }

    const user = await prisma.user.update({ where: { id: current.id }, data: patch });
    return NextResponse.json({ ok: true, user, changed: true });
  } catch (e) {
    return new NextResponse("Failed to initialize profile", { status: 500 });
  }
}

// Update profile fields explicitly (overwrite existing values)
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const data = await req.json();
  const update: Record<string, any> = {};
  for (const key of allowed) if (key in data) update[key] = data[key];
  try {
    const user = await prisma.user.update({ where: { id: (session.user as any).id }, data: update });
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    return new NextResponse("Failed to update profile", { status: 500 });
  }
}
