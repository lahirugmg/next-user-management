import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SessionDebugPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Session Debug</h1>
      <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">{JSON.stringify(session, null, 2)}</pre>
      {!session && <p className="text-red-600">No session.</p>}
    </div>
  );
}