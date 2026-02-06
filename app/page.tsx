"use client";

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";

export default function Home() {
  const { user } = useUser();
  const [text, setText] = useState("");

  if (!user) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Welcome!</h1>
        <SignInButton>
          <button>Sign In</button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hello, {user.firstName}!</h1>

      <SignOutButton>
        <button style={{ marginBottom: "1rem" }}>Sign Out</button>
      </SignOutButton>

      <input
        style={{ padding: "8px", fontSize: "1rem", width: "260px" }}
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <p style={{ marginTop: "1rem" }}>
        You typed: <strong>{text}</strong>
      </p>
    </div>
  );
}
