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
  dueTime?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
};

function Logo() {
  return (
    <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className="text-background">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/assignments");
    if (res.ok) setAssignments(await res.json());
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const handleDelete = async (id: string) => {
    await fetch(`/api/assignments/${id}`, { method: "DELETE" });
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdate = async (id: string, data: { priority?: string; status?: string }) => {
    const res = await fetch(`/api/assignments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setAssignments((prev) => prev.map((a) => a.id === id ? { ...a, ...updated } : a));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setAiResponse("");

    try {
      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setAiResponse(err.error ?? "Something went wrong. Please try again.");
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAiResponse((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setPrompt("");
    } catch {
      setAiResponse("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="text-sm font-semibold">TaskPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.firstName} {user?.lastName}
            </span>
            <SignOutButton>
              <Button variant="ghost" className="h-8 px-3 text-sm">Sign out</Button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">
            Good {getGreeting()}, {user?.firstName || "there"}.
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's your workspace.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — Assignments (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Card */}
            <div className="bg-background rounded-xl border border-border shadow-sm">
              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">Assignments</h2>
                  {!isLoading && (
                    <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                      {assignments.length}
                    </span>
                  )}
                </div>
                <div className="flex rounded-lg border border-border overflow-hidden text-xs">
                  <button
                    onClick={() => setView("list")}
                    className={`px-3 py-1.5 transition-colors ${
                      view === "list"
                        ? "bg-foreground text-background font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setView("calendar")}
                    className={`px-3 py-1.5 transition-colors ${
                      view === "calendar"
                        ? "bg-foreground text-background font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Calendar
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 py-4">
                {view === "list" ? (
                  <AssignmentList assignments={assignments} isLoading={isLoading} onDelete={handleDelete} onUpdate={handleUpdate} />
                ) : (
                  <AssignmentCalendar assignments={assignments} onDelete={handleDelete} onUpdate={handleUpdate} />
                )}
              </div>
            </div>
          </div>

          {/* Right — Sidebar (1/3 width) */}
          <div className="space-y-4">

            {/* Add Assignment */}
            <div className="bg-background rounded-xl border border-border shadow-sm">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Add Assignment</h2>
              </div>
              <div className="px-6 py-4">
                <AssignmentForm onSuccess={fetchAssignments} />
              </div>
            </div>

            {/* AI Planner */}
            <div className="bg-background rounded-xl border border-border shadow-sm">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">AI Study Planner</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask for a study plan, deadline help, or weekly schedule..."
                      rows={3}
                      disabled={isGenerating}
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!prompt.trim() || isGenerating}
                      className="absolute bottom-2.5 right-2.5 p-1.5 rounded-md bg-foreground text-background disabled:opacity-30 hover:opacity-80 transition-opacity"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
                <div className="flex flex-wrap gap-1.5">
                  {["Plan my week", "Help with deadlines", "Study schedule"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPrompt(s)}
                      disabled={isGenerating}
                      className="text-xs text-muted-foreground border border-border bg-background rounded-md px-2.5 py-1 hover:bg-muted transition-colors disabled:opacity-40"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {isGenerating && !aiResponse && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                    Generating your study plan…
                  </div>
                )}

                {aiResponse && (
                  <div className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {aiResponse}
                    {isGenerating && (
                      <span className="inline-block w-0.5 h-3.5 bg-foreground ml-0.5 animate-pulse align-text-bottom" />
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
