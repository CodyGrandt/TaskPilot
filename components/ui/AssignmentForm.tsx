"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAssignmentSchema, CreateAssignmentInput } from "@/lib/validations/assignment";
import { Button } from "@/components/ui/button";

type Props = { onSuccess: () => void };

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors";

export function AssignmentForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAssignmentInput>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: { priority: "MEDIUM" },
  });

  const onSubmit = async (data: CreateAssignmentInput) => {
    const dueDate = new Date(data.dueDate + "T00:00:00.000Z").toISOString();
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, dueDate }),
    });
    if (res.ok) { reset(); onSuccess(); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
        <input {...register("title")} placeholder="e.g. Chapter 5 Reading" className={inputCls} />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Due Date</label>
          <input type="date" {...register("dueDate")} className={inputCls} />
          {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Priority</label>
          <select {...register("priority")} className={inputCls}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Notes</label>
        <textarea
          {...register("description")}
          placeholder="Optional..."
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
        {isSubmitting ? "Adding..." : "Add Assignment"}
      </Button>
    </form>
  );
}
