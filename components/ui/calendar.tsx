import * as React from "react";

type CalendarProps = {
  className?: string;
};

export function Calendar({ className = "" }: CalendarProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-background p-4 ${className}`}
    >
      <div className="text-sm font-medium">Calendar (UI placeholder)</div>
      <div className="mt-3 grid grid-cols-7 gap-2 text-center text-sm text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="py-1 font-medium text-foreground">
            {d}
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-9 rounded-xl flex items-center justify-center bg-muted"
          >
            {i + 1 <= 31 ? i + 1 : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
