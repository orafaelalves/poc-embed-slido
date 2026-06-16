"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getUser, clearUser } from "@/lib/storage";
import type { EventUser } from "@/lib/storage";

// Dynamic import to avoid SSR issues with localStorage-dependent component
const SlidoEmbed = dynamic(() => import("@/components/SlidoEmbed"), {
  ssr: false,
  loading: () => (
    <div className="glass-card p-12 text-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  ),
});


export default function EventoPage() {
  const router = useRouter();
  const [user, setUser] = useState<EventUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = getUser();
    if (!saved) {
      router.replace("/");
      return;
    }
    setUser(saved);
    setReady(true);
  }, [router]);

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

  if (!ready || !user) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-hero-gradient text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
              FD
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none">Fórum DII 2026</p>
              <p className="text-xs text-white/40 mt-0.5">Takeda</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 glass-card px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium leading-none">{user.name}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  CRM {user.crmNumber}/{user.crmUf}
                </p>
              </div>
              <span className="tag-badge bg-green-500/20 text-green-400 border border-green-500/30 text-xs hidden sm:inline-flex">
                Credenciado
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="btn-secondary p-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome banner */}
        <div className="glass-card p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">
              Bem-vindo(a),{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {user.name
                  .split(" ")
                  .slice(0, /^dra?\.?$/i.test(user.name.split(" ")[0]) ? 2 : 1)
                  .join(" ")}
              </span>
              ! 👋
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              CRM {user.crmNumber}/{user.crmUf} · Cadastrado em{" "}
              {new Date(user.registeredAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="tag-badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
              🎟️ Acesso completo
            </span>
            <span className="tag-badge bg-green-500/20 text-green-400 border border-green-500/30 text-xs">
              ● Ao vivo agora
            </span>
          </div>
        </div>

        <div className="animate-fade-in">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Interação ao vivo com Sli.do</h2>
            <p className="text-sm text-white/50 mt-1">
              Faça perguntas, vote em enquetes e participe do evento em tempo real.
              {user.name && (
                <>
                  {" "}
                  Você está sendo identificado como{" "}
                  <strong className="text-white/80">{user.name}</strong> automaticamente.
                </>
              )}
            </p>
          </div>
          <SlidoEmbed user={{ name: user.name, email: user.email }} />
        </div>
      </div>
    </main>
  );
}
