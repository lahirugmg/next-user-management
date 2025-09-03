import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin?callbackUrl=/profile");
  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-gray-600">Manage your personal information.</p>
      </div>
      {user && <ProfileForm user={user} />}
      <div>
        <h2 className="text-lg font-medium mb-2">Raw Data</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}
