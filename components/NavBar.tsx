"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();
  return (
    <nav className="w-full bg-white border-b border-gray-200 mb-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-3">
        <Link href="/" className="font-semibold">UserMgmt</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/admin">Admin</Link>
          {status === "authenticated" ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600">Sign out</button>
          ) : (
            <Link className="text-blue-600" href="/auth/signin">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
