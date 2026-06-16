"use client";

import { buildSlidoUrl } from "@/lib/storage";
import type { EventUser } from "@/lib/storage";

const SLIDO_EVENT_CODE = "8m3EQAAuGQzfuvXTHP8qKF";

interface SlidoEmbedProps {
  user: Pick<EventUser, "name" | "email">;
}

export default function SlidoEmbed({ user }: SlidoEmbedProps) {
  const slidoUrl = buildSlidoUrl(SLIDO_EVENT_CODE, user);

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
      <div className="px-6 py-12 flex flex-col items-center text-center gap-5">
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
          <p className="font-semibold text-gray-800 mb-1">Participar do Sli.do</p>
          <p className="text-sm text-gray-500">
            Você será identificado automaticamente como<br />
            <strong className="text-gray-700">{user.name}</strong>
          </p>
        </div>
        <button
          onClick={() => { window.location.href = slidoUrl; }}
          className="w-full max-w-xs text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ background: "linear-gradient(to right, #732762, #5a1d4d)" }}
        >
          Entrar no Sli.do
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <p className="text-xs text-gray-400">
          Você entrará como <strong className="text-gray-500">{user.email}</strong>
        </p>
      </div>
    </div>
  );
}
