import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
    },
  });

  return user;
}
