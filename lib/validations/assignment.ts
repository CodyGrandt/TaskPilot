import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().min(1, "Due date is required"),
  dueTime: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]).default("NOT_STARTED"),
});

export const updateAssignmentSchema = z.object({
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]).optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
