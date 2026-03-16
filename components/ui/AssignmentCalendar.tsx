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

const priorityBadge: Record<string, string> = {
  HIGH:   "bg-red-50 text-red-600 ring-1 ring-red-200",
  MEDIUM: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  LOW:    "bg-green-50 text-green-600 ring-1 ring-green-200",
};

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function AssignmentCalendar({ assignments, onDelete }: Props) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  const dueDates = assignments.map((a) => new Date(a.dueDate));
  const selectedAssignments = selected
    ? assignments.filter((a) => isSameDay(new Date(a.dueDate), selected))
    : [];

  return (
    <div>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        modifiers={{ hasDue: dueDates }}
        modifiersStyles={{ hasDue: { fontWeight: "700", textDecoration: "underline", textUnderlineOffset: "3px" } }}
        styles={{ root: { width: "100%" }, month_grid: { width: "100%" } }}
      />

      {selected && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-3">
            {selected.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          {selectedAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing due.</p>
          ) : (
            <ul className="divide-y divide-border">
              {selectedAssignments.map((a) => (
                <li key={a.id} className="group flex items-start justify-between gap-4 py-3 px-1">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    {a.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityBadge[a.priority]}`}>
                      {a.priority.charAt(0) + a.priority.slice(1).toLowerCase()}
                    </span>
                    <button
                      onClick={() => onDelete(a.id)}
                      aria-label="Delete"
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-red-500 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
