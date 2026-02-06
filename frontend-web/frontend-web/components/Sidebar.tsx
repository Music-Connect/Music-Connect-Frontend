"use client";

import { useRouter } from "next/navigation";

interface SidebarProps {
  isArtist: boolean;
  activePage?: string;
  onLogout: () => void;
}

export default function Sidebar({
  isArtist,
  activePage,
  onLogout,
}: SidebarProps) {
  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <aside className="relative hidden w-72 md:flex flex-col px-8 py-7 border-r border-zinc-800/70 bg-[#0A0A0A]">
      <div className="absolute inset-x-0 top-0 h-32 bg-radial from-pink-500/20 via-transparent to-transparent" />

      <div className="relative mb-10">
        <div className="text-[22px] font-black tracking-tight">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500">
            Music Connect
          </span>
        </div>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
          {isArtist ? "Artist Hub" : "Hiring Desk"}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-900/70 px-3 py-1 text-[11px] font-semibold text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {isArtist ? "Perfil Artista" : "Perfil Contratante"}
        </span>
      </div>

      <nav className="relative flex flex-col gap-6 text-sm font-medium text-zinc-400">
        <div className="space-y-4">
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.28em]">
            Painel
          </p>

          <div onClick={() => navigate("/dashboard")}>
            <NavItem
              icon="📊"
              active={activePage === "dashboard" || !activePage}
            >
              Visão Geral
            </NavItem>
          </div>

          <div onClick={() => navigate("/proposals")}>
            <NavItem icon="📄" active={activePage === "proposals"}>
              {isArtist ? "Propostas" : "Minhas Contratações"}
            </NavItem>
          </div>

          <div onClick={() => navigate("/explore")}>
            <NavItem icon="🔍" active={activePage === "explore"}>
              Explorar
            </NavItem>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.28em]">
            {isArtist ? "Perfil" : "Organização"}
          </p>
          <div onClick={() => navigate("/profile")}>
            <NavItem icon="👤" active={activePage === "profile"}>
              {isArtist ? "Meu Perfil" : "Minha Empresa"}
            </NavItem>
          </div>
          <div onClick={() => navigate("/settings")}>
            <NavItem icon="⚙️" active={activePage === "settings"}>
              Configurações
            </NavItem>
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-6">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-800/70 bg-zinc-950/70 px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:border-zinc-600/70 hover:text-white"
        >
          Sair da conta
          <span className="text-base">↗</span>
        </button>
      </div>
    </aside>
  );
}

interface NavItemProps {
  children: React.ReactNode;
  icon: string;
  active?: boolean;
}

function NavItem({ children, icon, active }: NavItemProps) {
  return (
    <div
      className={`group flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-transparent text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
          : "hover:bg-zinc-900/60 hover:text-white"
      }`}
    >
      <span className="text-base">{icon}</span>
      <span className="flex-1">{children}</span>
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-amber-300" : "bg-transparent group-hover:bg-zinc-600"
        }`}
      />
    </div>
  );
}
