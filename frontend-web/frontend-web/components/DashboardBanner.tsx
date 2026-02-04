"use client";

import { useRouter } from "next/navigation";

interface DashboardBannerProps {
  isArtist: boolean;
}

export default function DashboardBanner({ isArtist }: DashboardBannerProps) {
  const router = useRouter();

  const bannerData = isArtist
    ? {
        badge: "🎵 Artista",
        title: "Gerencie suas propostas",
        desc: "Veja as ofertas recebidas e mantenha seu perfil atualizado para atrair mais contratantes.",
        btn: "Ver Meu Perfil",
        action: "/profile",
      }
    : {
        badge: "🏢 Contratante",
        title: "Encontre o artista ideal",
        desc: "Explore talentos, envie propostas e gerencie suas contratações de forma simples.",
        btn: "Explorar Artistas",
        action: "/explore",
      };

  return (
    <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-zinc-800 rounded-2xl p-8 mb-8 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"></span>
          {bannerData.badge}
        </span>
        <h1 className="text-4xl font-black text-white mb-4 leading-tight max-w-lg">
          {bannerData.title}
        </h1>
        <p className="text-zinc-400 text-sm max-w-md mb-8">{bannerData.desc}</p>
        <div>
          <button
            onClick={() => router.push(bannerData.action)}
            className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors"
          >
            {bannerData.btn}
          </button>
        </div>
      </div>
    </div>
  );
}
