"use client";

import React from "react"

import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Send } from "lucide-react";

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
  const [selectedDate] = useState<Date | undefined>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      // Handle AI prompt submission here
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - AI Prompt Section */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Hello, {user?.firstName || "Pilot"}!
              </h2>
              <p className="text-muted-foreground">
                What would you like to plan today?
              </p>
            </div>

            {/* AI Prompt Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Tell me about your tasks, deadlines, or study plans..."
                  className="w-full min-h-32 p-4 pr-12 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
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

            {/* Quick Actions */}
            <div className="space-y-3">
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

          {/* Right Column - Calendar */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="bg-background rounded-2xl border border-border p-4">
              <h3 className="text-lg font-medium text-foreground mb-4 text-center">
                Your Schedule
              </h3>
              <Calendar className="rounded-xl" />
              {selectedDate && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    Selected: {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
