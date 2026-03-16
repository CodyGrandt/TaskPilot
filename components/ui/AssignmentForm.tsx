"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAssignmentSchema, CreateAssignmentInput } from "@/lib/validations/assignment";
import { Button } from "@/components/ui/button";

type Props = {
  onSuccess: () => void;
};

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
    // Convert local date input (YYYY-MM-DD) to full ISO 8601 datetime
    const dueDate = new Date(data.dueDate + "T00:00:00.000Z").toISOString();

    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, dueDate }),
    });

    if (res.ok) {
      reset();
      onSuccess();
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const errorClass = "text-xs text-red-500 mt-1";
  const labelClass = "block text-sm font-medium text-foreground mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Title *</label>
        <input
          {...register("title")}
          placeholder="e.g. Chapter 5 Reading"
          className={inputClass}
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Due Date *</label>
        <input
          type="date"
          {...register("dueDate")}
          className={inputClass}
        />
        {errors.dueDate && <p className={errorClass}>{errors.dueDate.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Priority</label>
        <select {...register("priority")} className={inputClass}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          {...register("description")}
          placeholder="Optional notes..."
          rows={2}
          className={`${inputClass} resize-none`}
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl">
        {isSubmitting ? "Adding..." : "Add Assignment"}
      </Button>
    </form>
  );
}
