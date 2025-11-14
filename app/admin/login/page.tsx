"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const payload = await res.json();
        setError(payload.error || 'Login failed');
        setLoading(false);
        return;
      }
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded bg-white shadow">
        <h2 className="text-2xl mb-4">Admin Login</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        <label className="block mb-2">
          <div className="text-sm">Email</div>
          <input className="w-full border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label className="block mb-4">
          <div className="text-sm">Password</div>
          <input type="password" className="w-full border p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
