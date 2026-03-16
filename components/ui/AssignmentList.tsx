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

const priorityBadge: Record<string, string> = {
  HIGH:   "bg-red-50 text-red-600 ring-1 ring-red-200",
  MEDIUM: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  LOW:    "bg-green-50 text-green-600 ring-1 ring-green-200",
};

export function AssignmentList({ assignments, isLoading, onDelete }: Props) {
  if (isLoading) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Loading...</p>;
  }
  if (assignments.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No assignments yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {assignments.map((a) => (
        <li key={a.id} className="group flex items-start justify-between gap-4 py-3 px-1">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
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
  );
}
