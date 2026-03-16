import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    default: "bg-foreground text-background hover:bg-foreground/85",
    outline: "border border-border bg-background text-foreground hover:bg-accent",
    ghost:   "text-foreground hover:bg-accent",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
