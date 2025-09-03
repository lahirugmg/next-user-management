import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin?callbackUrl=/profile");
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(session.user, null, 2)}</pre>
    </div>
  );
}
