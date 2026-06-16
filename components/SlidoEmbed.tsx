"use client";

import { useState, useEffect } from "react";
import { buildSlidoUrl } from "@/lib/storage";
import type { EventUser } from "@/lib/storage";

const SLIDO_EVENT_CODE = "8m3EQAAuGQzfuvXTHP8qKF";

interface SlidoEmbedProps {
  user: Pick<EventUser, "name" | "email">;
}

export default function SlidoEmbed({ user }: SlidoEmbedProps) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const slidoUrl = buildSlidoUrl(SLIDO_EVENT_CODE, user);

  if (isMobile) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Sli.do ao vivo</span>
          </div>
          <span
            className="tag-badge text-xs border"
            style={{ backgroundColor: "rgba(115,39,98,0.1)", color: "#732762", borderColor: "rgba(115,39,98,0.25)" }}
          >
            {user.name}
          </span>
        </div>
        <div className="px-6 py-10 flex flex-col items-center text-center gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(115,39,98,0.08)" }}
          >
            <svg className="w-8 h-8" style={{ color: "#732762" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Abrir o Sli.do</p>
            <p className="text-sm text-gray-500">
              Você será identificado automaticamente como<br />
              <strong className="text-gray-700">{user.name}</strong> ({user.email})
            </p>
          </div>
          <a
            href={slidoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
            style={{ background: "linear-gradient(to right, #732762, #5a1d4d)" }}
          >
            Participar agora
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-xs text-gray-400">
            O link já inclui seu nome e e-mail para identificação automática.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-gray-700">Sli.do ao vivo</span>
        </div>
        <span
          className="tag-badge text-xs border"
          style={{ backgroundColor: "rgba(115,39,98,0.1)", color: "#732762", borderColor: "rgba(115,39,98,0.25)" }}
        >
          Identificado como: {user.name}
        </span>
      </div>
      <div className="relative" style={{ height: "640px" }}>
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div
                className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
                style={{ borderColor: "#732762", borderTopColor: "transparent" }}
              />
              <p className="text-sm text-gray-400">Carregando sli.do...</p>
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
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <p className="text-xs text-gray-400">
          Problemas com o embed? Acesse o sli.do diretamente:
        </p>
        <a
          href={slidoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs whitespace-nowrap inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-all"
        >
          Entrar no sli.do
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
