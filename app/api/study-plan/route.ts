import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    return NextResponse.json({ recommendations: [] });
  }

  const recommendations = await prisma.aIRecommendation.findMany({
    where: { userId: user.id },
    orderBy: { generatedAt: "desc" },
  });

  return NextResponse.json({ recommendations });
}

export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Stub: AI study plan generation will be implemented in a future phase
  return NextResponse.json(
    { message: "Study plan generation not yet implemented" },
    { status: 501 }
  );
}
