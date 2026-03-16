"use client";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  dueTime?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
};

type Props = {
  assignments: Assignment[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: { priority?: string; status?: string }) => void;
};

const priorityBadge: Record<string, string> = {
  HIGH:   "bg-red-50 text-red-600 ring-1 ring-red-200",
  MEDIUM: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  LOW:    "bg-green-50 text-green-600 ring-1 ring-green-200",
};

const statusBadge: Record<string, string> = {
  NOT_STARTED: "bg-gray-50 text-gray-400 ring-1 ring-gray-200",
  IN_PROGRESS: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  COMPLETE:    "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
};

const statusLabel: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETE:    "Complete",
};

export function AssignmentList({ assignments, isLoading, onDelete, onUpdate }: Props) {
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
              {a.dueTime && <span> at {formatTime(a.dueTime)}</span>}
            </p>
            {a.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            <select
              value={a.status}
              onChange={(e) => onUpdate(a.id, { status: e.target.value })}
              className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer appearance-none ${statusBadge[a.status]}`}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETE">Complete</option>
            </select>
            <select
              value={a.priority}
              onChange={(e) => onUpdate(a.id, { priority: e.target.value })}
              className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer appearance-none ${priorityBadge[a.priority]}`}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
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

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}
