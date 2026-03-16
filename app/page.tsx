import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Nav */}
      <header className="bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="text-background">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">TaskPilot</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
              Log in
            </Link>
            <Link href="/sign-up"
              className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-lg hover:opacity-85 transition-opacity">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-foreground rounded-xl flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-background">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">TaskPilot</h1>
            <p className="text-base text-muted-foreground mt-3 leading-relaxed">
              An AI-powered study planner that helps students manage assignments,
              deadlines, and build better study habits.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/sign-up"
              className="text-sm font-medium bg-foreground text-background px-6 py-2.5 rounded-lg hover:opacity-85 transition-opacity shadow-sm">
              Get started
            </Link>
            <Link href="/sign-in"
              className="text-sm font-medium text-foreground bg-background border border-border px-6 py-2.5 rounded-lg hover:bg-accent transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
