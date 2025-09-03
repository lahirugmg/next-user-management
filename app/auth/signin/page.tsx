"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  return (
    <div className="space-y-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold text-center">Sign In</h1>
      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Continue with Google
      </button>
    </div>
  );
}
