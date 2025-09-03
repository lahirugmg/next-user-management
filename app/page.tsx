import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p>This is a minimal user management demo with Google login.</p>
      {session ? (
        <div className="space-y-2">
          <p>Signed in as {session.user?.email}</p>
          <div className="flex gap-3">
            <Link className="underline" href="/dashboard">Dashboard</Link>
            <Link className="underline" href="/profile">Profile</Link>
            <Link className="underline" href="/admin">Admin</Link>
          </div>
        </div>
      ) : (
        <Link className="text-blue-600 underline" href="/auth/signin">Sign in</Link>
      )}
    </div>
  );
}
