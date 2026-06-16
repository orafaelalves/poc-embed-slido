"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getUser, clearUser } from "@/lib/storage";
import type { EventUser } from "@/lib/storage";

const SlidoEmbed = dynamic(() => import("@/components/SlidoEmbed"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div
        className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
        style={{ borderColor: "#732762", borderTopColor: "transparent" }}
      />
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#e2d6d8" }}>
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#732762", borderTopColor: "transparent" }}
        />
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
    <main className="min-h-screen" style={{ backgroundColor: "#e2d6d8" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50"
        style={{
          backgroundImage: "url(/bg-lateral.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl px-2 py-1.5 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Fórum DII 2026 · Takeda"
                width={75}
                height={40}
                className="object-contain"
                style={{ height: "50px" }}
                priority
              />
            </div>
            <span className="text-white font-semibold text-sm leading-tight">
              Fórum DII Takeda 2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                style={{ background: "linear-gradient(135deg, #732762, #a04590)" }}
              >
                {initials}
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium leading-none text-white">{user.name}</p>
                <p className="text-white/60 text-xs mt-0.5">
                  CRM {user.crmNumber}/{user.crmUf}
                </p>
              </div>
              <span className="tag-badge bg-green-500/20 text-green-300 border border-green-500/30 text-xs hidden sm:inline-flex">
                Credenciado
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="bg-white/15 hover:bg-white/25 border border-white/20 text-white p-2 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Sli.do */}
        <div className="animate-fade-in">
          <p className="text-sm text-gray-500 mb-4">
            Faça perguntas, vote em enquetes e participe do evento em tempo real.
          </p>
          <SlidoEmbed user={{ name: user.name, email: user.email }} />
        </div>
      </div>
    </main>
  );
}
