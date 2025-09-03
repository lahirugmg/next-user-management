"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Session } from "next-auth";

export default function SessionProviders({ session, children }: { session: Session | null; children: ReactNode }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}