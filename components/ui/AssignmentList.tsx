"use client";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

type Props = {
  assignments: Assignment[];
  isLoading: boolean;
  onDelete: (id: string) => void;
};

const priorityStyles: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};

export function AssignmentList({ assignments, isLoading, onDelete }: Props) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>;
  }

  if (assignments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No assignments yet. Add one above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {assignments.map((a) => (
        <li
          key={a.id}
          className="rounded-xl border border-border bg-background p-4 space-y-1"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium text-foreground text-sm">{a.title}</span>
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
          <p className="text-xs text-muted-foreground">
            Due: {new Date(a.dueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          {a.description && (
            <p className="text-xs text-muted-foreground">{a.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
