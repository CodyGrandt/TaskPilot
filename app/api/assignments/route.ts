import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createAssignmentSchema } from "@/lib/validations/assignment";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const assignments = await prisma.assignment.findMany({
    where: { userId: user.id },
    orderBy: { dueDate: "asc" },
    include: { studySessions: true },
  });

  return NextResponse.json(assignments);
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createAssignmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const clerkUser = await currentUser();
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      name: `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || null,
    },
  });

  const assignment = await prisma.assignment.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: new Date(parsed.data.dueDate + "T00:00:00.000Z"),
      dueTime: parsed.data.dueTime || null,
      priority: parsed.data.priority,
      status: parsed.data.status,
      userId: user.id,
    },
  });

  return NextResponse.json(assignment, { status: 201 });
}
