"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { AssignmentForm } from "@/components/ui/AssignmentForm";
import { AssignmentList } from "@/components/ui/AssignmentList";
import { AssignmentCalendar } from "@/components/ui/AssignmentCalendar";
import { Send } from "lucide-react";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

function PilotIcon({ size = "default" }: { size?: "small" | "default" }) {
  const dimensions = size === "small" ? "w-10 h-10" : "w-16 h-16";
  const iconSize = size === "small" ? 20 : 32;

  return (
    <div className={`${dimensions} bg-foreground rounded-xl flex items-center justify-center`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
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

export default function Dashboard() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");

  const fetchAssignments = useCallback(async () => {
    setIsLoadingAssignments(true);
    const res = await fetch("/api/assignments");
    if (res.ok) {
      const data = await res.json();
      setAssignments(data);
    }
    setIsLoadingAssignments(false);
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDelete = async (id: string) => {
    await fetch(`/api/assignments/${id}`, { method: "DELETE" });
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      console.log("Submitted prompt:", prompt);
      setPrompt("");
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PilotIcon size="small" />
            <h1 className="text-xl font-semibold italic text-foreground">TaskPilot</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">
              {user?.firstName || "Pilot"}
            </span>
            <SignOutButton>
              <Button variant="outline" className="rounded-full bg-transparent">
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Hello, {user?.firstName || "Pilot"}!
          </h2>
          <p className="text-muted-foreground">What would you like to plan today?</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column — Assignments */}
          <div className="space-y-6">
            <div className="bg-background rounded-2xl border border-border p-5 space-y-4">
              <h3 className="text-lg font-medium text-foreground">Add Assignment</h3>
              <AssignmentForm onSuccess={fetchAssignments} />
            </div>

            <div className="bg-background rounded-2xl border border-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Your Assignments</h3>
                <div className="flex rounded-xl border border-border overflow-hidden text-sm">
                  <button
                    onClick={() => setView("list")}
                    className={`px-3 py-1 transition-colors ${view === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setView("calendar")}
                    className={`px-3 py-1 transition-colors ${view === "calendar" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    Calendar
                  </button>
                </div>
              </div>
              {view === "list" ? (
                <AssignmentList assignments={assignments} isLoading={isLoadingAssignments} onDelete={handleDelete} />
              ) : (
                <AssignmentCalendar assignments={assignments} onDelete={handleDelete} />
              )}
            </div>
          </div>

          {/* Right Column — AI Prompt */}
          <div className="space-y-6">
            <div className="bg-background rounded-2xl border border-border p-5 space-y-4">
              <h3 className="text-lg font-medium text-foreground">AI Study Planner</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tell me about your tasks, deadlines, or study plans..."
                    className="w-full min-h-32 p-4 pr-12 rounded-2xl border border-border bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  <Button
                    type="submit"
                    className="absolute bottom-3 right-3 rounded-full bg-foreground text-background hover:bg-foreground/90"
                    disabled={!prompt.trim()}
                  >
                    <Send className="w-4 h-4" />
                    <span className="sr-only">Send prompt</span>
                  </Button>
                </div>
              </form>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Quick prompts:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Plan my study schedule",
                    "Help with assignment deadlines",
                    "Organize my week",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      className="rounded-full bg-transparent text-xs"
                      onClick={() => setPrompt(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
