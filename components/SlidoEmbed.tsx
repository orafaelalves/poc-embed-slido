"use client";

import { useState, useEffect } from "react";
import { buildSlidoUrl, saveSlidoCode, getSlidoCode } from "@/lib/storage";
import type { EventUser } from "@/lib/storage";

interface SlidoEmbedProps {
  user: Pick<EventUser, "name" | "email">;
}

const PLANS = [
  {
    name: "Gratuito",
    color: "text-slate-300",
    badge: "bg-slate-700/50 border-slate-600/50",
    features: [
      { ok: true, label: "Participação anônima (usuário escolhe o nome no sli.do)" },
      { ok: false, label: "Pré-identificação via URL params" },
      { ok: false, label: "SSO / identidade bloqueada" },
    ],
  },
  {
    name: "Business",
    color: "text-purple-300",
    badge: "bg-purple-700/30 border-purple-500/40",
    features: [
      { ok: true, label: "Participação anônima" },
      { ok: true, label: "Pré-identificação via URL params (?user_name= / ?user_email=)" },
      { ok: false, label: "SSO / identidade bloqueada" },
    ],
  },
  {
    name: "Enterprise",
    color: "text-amber-300",
    badge: "bg-amber-700/20 border-amber-500/30",
    features: [
      { ok: true, label: "Participação anônima" },
      { ok: true, label: "Pré-identificação via URL params" },
      { ok: true, label: "SSO via SAML/Webex — identidade vinculada e imutável" },
    ],
  },
];

export default function SlidoEmbed({ user }: SlidoEmbedProps) {
  const [eventCode, setEventCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [editing, setEditing] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    const saved = getSlidoCode();
    setEventCode(saved);
    setInputCode(saved);
  }, []);

  const slidoUrl = eventCode ? buildSlidoUrl(eventCode, user) : "";

  const handleSaveCode = () => {
    const trimmed = inputCode.trim();
    saveSlidoCode(trimmed);
    setEventCode(trimmed);
    setEditing(false);
    setIframeLoading(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSaveCode();
    if (e.key === "Escape") {
      setInputCode(eventCode);
      setEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Config bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wider">
              Código do evento sli.do
            </p>
            {editing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ex: 7q0zb4jq"
                  className="input-field text-sm py-2"
                  autoFocus
                />
                <button onClick={handleSaveCode} className="btn-secondary whitespace-nowrap">
                  Salvar
                </button>
                <button
                  onClick={() => { setInputCode(eventCode); setEditing(false); }}
                  className="btn-secondary"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <code className="text-purple-300 font-mono text-sm bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-500/20">
                  {eventCode || <span className="text-white/30 italic">não configurado</span>}
                </code>
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary text-xs"
                >
                  Alterar
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPlans(!showPlans)}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Como funciona a identificação?
          </button>
        </div>

        {/* URL gerada */}
        {slidoUrl && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-white/40 mb-1.5 font-medium">URL gerada com seus dados:</p>
            <div className="flex items-start gap-2">
              <code className="flex-1 text-xs text-green-300 bg-green-900/20 border border-green-500/20 rounded-lg px-3 py-2 break-all leading-relaxed font-mono">
                {slidoUrl}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(slidoUrl)}
                title="Copiar URL"
                className="flex-shrink-0 btn-secondary p-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-white/30 mt-1.5">
              Parâmetros{" "}
              <code className="text-purple-300">?user_name</code> e{" "}
              <code className="text-purple-300">?user_email</code>{" "}
              pré-identificam o participante no sli.do (plano Business+)
            </p>
          </div>
        )}
      </div>

      {/* Plans info */}
      {showPlans && (
        <div className="glass-card p-6 animate-slide-up">
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/60">
            Identificação no sli.do por plano
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-4 border ${plan.badge}`}
              >
                <p className={`font-bold text-sm mb-3 ${plan.color}`}>
                  {plan.name}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className={f.ok ? "text-green-400 mt-0.5" : "text-white/20 mt-0.5"}>
                        {f.ok ? "✓" : "✗"}
                      </span>
                      <span className={f.ok ? "text-white/80" : "text-white/30"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-4">
            No plano gratuito, participantes podem interagir de forma anônima ou escolher um nome manualmente no sli.do.
            Com Business, seus dados do cadastro da LP são enviados automaticamente via URL.
            Com Enterprise, o SSO garante que a identidade não pode ser alterada pelo usuário.
          </p>
        </div>
      )}

      {/* Iframe embed */}
      {eventCode ? (
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">Sli.do ao vivo</span>
            </div>
            <span className="tag-badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
              Identificado como: {user.name}
            </span>
          </div>
          <div className="relative" style={{ height: "640px" }}>
            {iframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-white/50">Carregando sli.do...</p>
                </div>
              </div>
            )}
            <iframe
              src={slidoUrl}
              title="Sli.do evento ao vivo"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="camera *; microphone *; autoplay *; encrypted-media *"
              onLoad={() => setIframeLoading(false)}
              className="w-full h-full"
            />
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Sli.do não configurado</h3>
          <p className="text-sm text-white/40 mb-4">
            Clique em "Alterar" acima e insira o código do seu evento sli.do
            para ativar o embed interativo.
          </p>
          <button
            onClick={() => setEditing(true)}
            className="btn-secondary mx-auto inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v16m8-8H4" />
            </svg>
            Configurar código do evento
          </button>
        </div>
      )}
    </div>
  );
}
