import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ clerkId: clerkUser.id }, { email }] },
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: { clerkId: clerkUser.id, email, name },
    });
  }

  return prisma.user.create({
    data: { clerkId: clerkUser.id, email, name },
  });
}
