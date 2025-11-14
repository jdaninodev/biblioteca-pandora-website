"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
    >
      {loading ? 'Cerrando...' : 'Cerrar sesión'}
    </button>
  );
}
