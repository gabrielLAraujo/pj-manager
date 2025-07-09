"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";

export function AuthDebug() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Auth</h3>
      <div className="space-y-1">
        <p>Status: {status}</p>
        <p>isLoading: {isLoading.toString()}</p>
        <p>isAuthenticated: {isAuthenticated.toString()}</p>
        <p>User: {user ? JSON.stringify(user, null, 2) : "null"}</p>
        <p>Session: {session ? JSON.stringify(session, null, 2) : "null"}</p>
      </div>
    </div>
  );
}
