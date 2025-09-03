import "./globals.css";
import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import SessionProviders from "@/components/SessionProviders";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "User Management",
  description: "Simple Next.js user management with Google login"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProviders session={session}>
          <NavBar />
          <main className="max-w-4xl mx-auto p-4">{children}</main>
        </SessionProviders>
      </body>
    </html>
  );
}
