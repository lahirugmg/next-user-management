"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  phone?: string | null;
  image?: string | null;
  email?: string | null;
  name?: string | null;
  role: string;
}

export default function ProfileForm({ user }: { user: UserProfile }) {
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    displayName: user.displayName || user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    phone: user.phone || ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-5 border rounded shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">First Name</label>
          <input name="firstName" value={form.firstName} onChange={onChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Last Name</label>
          <input name="lastName" value={form.lastName} onChange={onChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Display Name</label>
          <input name="displayName" value={form.displayName} onChange={onChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Location</label>
          <input name="location" value={form.location} onChange={onChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Website</label>
          <input name="website" value={form.website} onChange={onChange} placeholder="https://" className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1">Bio</label>
          <textarea name="bio" value={form.bio} onChange={onChange} rows={3} className="w-full border px-2 py-1 rounded resize-none" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button disabled={saving} className="bg-blue-600 disabled:opacity-60 text-white px-4 py-2 rounded">
          {saving ? "Saving..." : "Save"}
        </button>
        {success && <span className="text-green-600 text-sm">Saved.</span>}
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
    </form>
  );
}