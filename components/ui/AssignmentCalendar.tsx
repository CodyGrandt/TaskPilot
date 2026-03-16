"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

type Props = {
  assignments: Assignment[];
  onDelete: (id: string) => void;
};

const priorityStyles: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function AssignmentCalendar({ assignments, onDelete }: Props) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  const dueDates = assignments.map((a) => new Date(a.dueDate));

  const selectedAssignments = selected
    ? assignments.filter((a) => isSameDay(new Date(a.dueDate), selected))
    : [];

  return (
    <div className="space-y-4">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        modifiers={{ hasDue: dueDates }}
        modifiersStyles={{
          hasDue: {
            fontWeight: "bold",
            textDecoration: "underline",
            color: "var(--foreground)",
          },
        }}
        styles={{
          root: { width: "100%" },
          month_grid: { width: "100%" },
        }}
      />

      {selected && (
        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground mb-2">
            {selected.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          {selectedAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assignments due.</p>
          ) : (
            <ul className="space-y-2">
              {selectedAssignments.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-border bg-muted p-3 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{a.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${priorityStyles[a.priority]}`}
                      >
                        {a.priority}
                      </span>
                      <button
                        onClick={() => onDelete(a.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors text-xs"
                        aria-label="Delete assignment"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {a.description && (
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
