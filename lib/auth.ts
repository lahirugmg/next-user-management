import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions, Session } from "next-auth";
import { prisma } from "./prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as Session["user"] & { id: string; role?: string }).id = user.id;
        (session.user as any).role = user.role;
      }
      return session;
    },
    async signIn({ user }) {
      // Promote to admin automatically if email matches ADMIN_EMAIL
      if (user.email && process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {
        await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } }).catch(() => {});
      }
      return true;
    }
  }
};
