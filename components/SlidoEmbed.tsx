"use client";

import { useState } from "react";
import { buildSlidoUrl } from "@/lib/storage";
import type { EventUser } from "@/lib/storage";

const SLIDO_EVENT_CODE = "8mX4X23TmTGKDpQmBXUM8P";

interface SlidoEmbedProps {
  user: Pick<EventUser, "name" | "email">;
}

export default function SlidoEmbed({ user }: SlidoEmbedProps) {
  const [iframeLoading, setIframeLoading] = useState(true);

  const slidoUrl = buildSlidoUrl(SLIDO_EVENT_CODE, user);

  return (
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
  );
}
