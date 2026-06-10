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

const AGENDA = [
  { time: "09:00", title: "Abertura e boas-vindas", speaker: "Organização TechSummit", type: "keynote" },
  { time: "09:30", title: "IA Generativa em produção: lições do Nubank", speaker: "Ana Silva · CTO, Nubank", type: "palestra" },
  { time: "10:30", title: "Scale de engenharia: de 10 a 500 devs", speaker: "Rafael Moura · VP Eng, iFood", type: "palestra" },
  { time: "11:30", title: "Coffee break & networking", speaker: "", type: "break" },
  { time: "14:00", title: "LLMs em apps B2B: casos reais com Totvs", speaker: "Julia Costa · AI Lead, Totvs", type: "palestra" },
  { time: "15:30", title: "Painel: O futuro do desenvolvimento no Brasil", speaker: "Mesa redonda com 4 CTOs", type: "painel" },
];

const TYPE_STYLES: Record<string, string> = {
  keynote: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  palestra: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  painel: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  break: "bg-white/10 text-white/40 border-white/10",
};

export default function EventoPage() {
  const router = useRouter();
  const [user, setUser] = useState<EventUser | null>(null);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<"slido" | "agenda">("slido");

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
              TS
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none">TechSummit Brasil 2025</p>
              <p className="text-xs text-white/40 mt-0.5">26–27 Jun · São Paulo, SP</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 glass-card px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium leading-none">{user.name}</p>
                {user.company && (
                  <p className="text-white/40 text-xs mt-0.5">{user.company}</p>
                )}
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
                {user.name.split(" ")[0]}
              </span>
              ! 👋
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              {user.role && `${user.role} ${user.company ? `· ${user.company}` : ""} · `}
              Cadastrado em{" "}
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

        {/* Tab navigation */}
        <div className="flex gap-1 glass-card p-1 w-fit mb-6">
          {(["slido", "agenda"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {tab === "slido" ? "💬 Interação ao vivo" : "📅 Programação"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "slido" ? (
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
        ) : (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Programação do dia</h2>
            <div className="space-y-3">
              {AGENDA.map((item, i) => (
                <div
                  key={i}
                  className={`glass-card p-4 flex items-start gap-4 ${
                    item.type === "break" ? "opacity-50" : ""
                  }`}
                >
                  <div className="text-sm font-mono text-white/40 w-12 flex-shrink-0 pt-0.5">
                    {item.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <span
                        className={`tag-badge border flex-shrink-0 text-xs ${TYPE_STYLES[item.type]}`}
                      >
                        {item.type}
                      </span>
                    </div>
                    {item.speaker && (
                      <p className="text-xs text-white/40 mt-1">{item.speaker}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
