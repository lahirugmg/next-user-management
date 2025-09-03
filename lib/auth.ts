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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist id & role into token
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if ((token as any)?.id) (session.user as any).id = (token as any).id;
        if ((token as any)?.role) (session.user as any).role = (token as any).role;
      }
      return session;
    },
    async signIn({ user, profile }) {
      // Promote to admin automatically if email matches ADMIN_EMAIL
      if (user.email && process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {
        await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } }).catch(() => {});
      }
      // Attempt to populate profile fields on first sign-in
      if (profile && user.id) {
        const updateData: any = {};
        if (!user.name && (profile as any).name) updateData.name = (profile as any).name;
        if ((profile as any).given_name) updateData.firstName = (profile as any).given_name;
        if ((profile as any).family_name) updateData.lastName = (profile as any).family_name;
        if ((profile as any).name) updateData.displayName = (profile as any).name;
        if (Object.keys(updateData).length > 0) {
          await prisma.user.update({ where: { id: user.id }, data: updateData }).catch(() => {});
        }
      }
      return true;
    }
  }
};
