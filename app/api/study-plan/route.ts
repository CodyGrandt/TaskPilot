import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert AI study planner helping a student manage their academic workload. \
You have access to their current assignments, due dates, priorities, and completion statuses.

Give personalized, actionable advice. Be concise and structured — use bullet points or short sections. \
Prioritize upcoming deadlines and flag anything urgent. When suggesting a study schedule, be specific \
about time blocks. Always end with one clear "next step" the student should take today.`;

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
    take: 10,
  });

  return NextResponse.json({ recommendations });
}

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "AI service is not configured." }, { status: 503 });
    }

    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const prompt: string = body.prompt?.trim() ?? "";
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        assignments: {
          where: { status: { not: "COMPLETE" } },
          orderBy: { dueDate: "asc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const assignmentContext =
      user.assignments.length === 0
        ? "No current assignments."
        : user.assignments
            .map((a) => {
              const due = new Date(a.dueDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const time = a.dueTime ? ` at ${a.dueTime}` : "";
              return `- ${a.title} | Due: ${due}${time} | Priority: ${a.priority} | Status: ${a.status}${a.description ? ` | Notes: ${a.description}` : ""}`;
            })
            .join("\n");

    const userMessage = `My current assignments:\n${assignmentContext}\n\nMy request: ${prompt}`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    let fullText = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const stream = anthropic.messages.stream({
            model: "claude-opus-4-7",
            max_tokens: 1024,
            thinking: { type: "adaptive" },
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userMessage }],
          });

          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              fullText += event.delta.text;
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }

          await prisma.aIRecommendation.create({
            data: { content: fullText, userId: user.id },
          });
        } catch (err) {
          controller.error(err);
          return;
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("[study-plan POST]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
