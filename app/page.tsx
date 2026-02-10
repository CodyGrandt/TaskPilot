import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function PilotIcon() {
  return (
    <div className="w-16 h-16 bg-foreground rounded-xl flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-background"
      >
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    </div>
  );
}

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <PilotIcon />
        </div>

        <h1 className="text-4xl font-semibold italic text-foreground">
          TaskPilot
        </h1>

        <p className="text-muted-foreground text-balance">
          An AI driven planner that helps students plan tasks such as studying
          and working on assignments
        </p>

        <div className="flex flex-col items-center gap-3 pt-4">
          <Link href="/sign-in" className="w-64">
            <Button variant="outline" className="w-full rounded-full bg-transparent">
              Login
            </Button>
          </Link>

          <Link href="/sign-up" className="w-64">
            <Button variant="outline" className="w-full rounded-full bg-transparent">
              Signup
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
