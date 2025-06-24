"use client";

import UserProfile from "@/app/components/UserProfile";

export default function PerfilPage() {
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Tu Perfil</h1>
      <UserProfile />
    </main>
  );
}
