"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";

interface Registration {
  id?: number;
  name: string;
  email: string;
  crm_uf: string;
  crm_number: string;
  privacy_consent: boolean;
  comms_consent: boolean;
  registered_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function exportCSV(data: Registration[]) {
  const headers = ["Nome", "E-mail", "UF", "CRM", "Privacidade", "Comunicações", "Data de cadastro"];
  const rows = data.map((r) => [
    r.name,
    r.email,
    r.crm_uf,
    r.crm_number,
    r.privacy_consent ? "Sim" : "Não",
    r.comms_consent ? "Sim" : "Não",
    formatDate(r.registered_at),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cadastros-forum-dii-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchRegistrations() {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("registered_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setRegistrations(data ?? []);
      }
      setLoading(false);
    }
    fetchRegistrations();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return registrations;
    return registrations.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.crm_number.includes(q) ||
        r.crm_uf.toLowerCase().includes(q)
    );
  }, [registrations, search]);

  const today = new Date().toDateString();
  const todayCount = registrations.filter(
    (r) => new Date(r.registered_at).toDateString() === today
  ).length;
  const privacyCount = registrations.filter((r) => r.privacy_consent).length;
  const commsCount = registrations.filter((r) => r.comms_consent).length;

  const brand = "#8a1761";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="text-white px-6 py-4 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${brand}, #5a1d4d)` }}>
        <div>
          <h1 className="text-lg font-bold">Painel de Cadastros</h1>
          <p className="text-white/70 text-xs">Fórum DII Takeda 2026</p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-medium px-4 py-2 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar CSV
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Dashboard cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total de inscritos", value: registrations.length, icon: "👥" },
            { label: "Cadastros hoje", value: todayCount, icon: "📅" },
            { label: "Aceite de privacidade", value: privacyCount, icon: "✅" },
            { label: "Aceite de comunicações", value: commsCount, icon: "📧" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-2xl mb-1">{card.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{loading ? "—" : card.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Search + table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nome, e-mail ou CRM…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-gray-300"
              />
            </div>
            {search && (
              <span className="text-xs text-gray-500">
                {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: brand, borderTopColor: "transparent" }}
              />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              {search ? "Nenhum resultado encontrado." : "Nenhum cadastro ainda."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                    <th className="px-5 py-3">Nome</th>
                    <th className="px-5 py-3">E-mail</th>
                    <th className="px-5 py-3">CRM</th>
                    <th className="px-5 py-3 text-center">Privacidade</th>
                    <th className="px-5 py-3 text-center">Comunicações</th>
                    <th className="px-5 py-3">Cadastrado em</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-800">{r.name}</td>
                      <td className="px-5 py-3 text-gray-600">{r.email}</td>
                      <td className="px-5 py-3 text-gray-600">{r.crm_number}/{r.crm_uf}</td>
                      <td className="px-5 py-3 text-center">
                        {r.privacy_consent
                          ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold">✓</span>
                          : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-400 text-xs font-bold">✗</span>}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {r.comms_consent
                          ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold">✓</span>
                          : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-400 text-xs font-bold">✗</span>}
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(r.registered_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
