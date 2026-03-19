"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ProposalCard from "@/components/ProposalCard";
import { api, User, Proposta } from "@/lib/api";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
  delay,
}: {
  label: string;
  value: number | string;
  icon: string;
  accent: string;
  sub?: string;
  delay?: string;
}) {
  return (
    <div
      className={`fade-in-up group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-zinc-700/80 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5`}
      style={{ animationDelay: delay }}
    >
      <div
        className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-[0.08] transition-opacity duration-500 group-hover:opacity-20 ${accent}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            {label}
          </p>
          <p className="text-3xl font-black text-white tracking-tight tabular-nums">
            {value}
          </p>
          {sub && (
            <p className="mt-1.5 text-[11px] text-zinc-500 leading-snug">
              {sub}
            </p>
          )}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 text-lg shrink-0">
          {icon}
        </span>
      </div>
    </div>
  );
}

/* ── Activity bar ── */
function ActivityBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-right text-[11px] text-zinc-500 tabular-nums capitalize">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-zinc-800/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-amber-400 via-rose-400 to-fuchsia-500 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-[11px] text-zinc-500 tabular-nums">
        {value}
      </span>
    </div>
  );
}

/* ── Quick Action ── */
function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 w-full rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3.5 text-left text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-white hover:shadow-lg hover:shadow-black/10 active:scale-[0.98]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-base">
        {icon}
      </span>
      {label}
      <span className="ml-auto text-zinc-600 transition-transform duration-200 group-hover:translate-x-0.5">
        →
      </span>
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedType = localStorage.getItem("type");

        if (!storedUser || !storedType) {
          router.push("/login");
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        let proposalsData: Proposta[] = [];
        if (storedType === "artista") {
          proposalsData = await api.getPropostasRecebidas();
        } else {
          proposalsData = await api.getPropostasEnviadas();
        }

        setProposals(proposalsData);
      } catch (error: unknown) {
        console.error("Erro ao carregar dados:", error);
        if (error instanceof Error && error.message.includes("401")) {
          localStorage.removeItem("user");
          localStorage.removeItem("type");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("type");
      router.push("/login");
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/explore?search=${searchTerm}`);
    }
  };

  const handleAcceptDecline = async (id: number, status: string) => {
    try {
      await api.updatePropostaStatus(id, status);
      setProposals(
        proposals.map((p) =>
          p.id_proposta === id
            ? {
                ...p,
                status: status as
                  | "pendente"
                  | "aceita"
                  | "recusada"
                  | "cancelada",
              }
            : p,
        ),
      );
    } catch {
      alert("Erro ao atualizar status.");
    }
  };

  /* ── Computed stats ── */
  const stats = useMemo(() => {
    const pendentes = proposals.filter((p) => p.status === "pendente").length;
    const aceitas = proposals.filter((p) => p.status === "aceita").length;
    const recusadas = proposals.filter((p) => p.status === "recusada").length;
    const canceladas = proposals.filter((p) => p.status === "cancelada").length;
    const valorTotal = proposals
      .filter((p) => p.status === "aceita")
      .reduce((sum, p) => sum + (p.valor_oferecido || 0), 0);
    return {
      pendentes,
      aceitas,
      recusadas,
      canceladas,
      valorTotal,
      total: proposals.length,
    };
  }, [proposals]);

  /* ── Monthly activity (last 6 months) ── */
  const monthlyActivity = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", "");
      months[key] = 0;
    }
    proposals.forEach((p) => {
      if (!p.created_at) return;
      const d = new Date(p.created_at);
      const key = d
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", "");
      if (key in months) months[key]++;
    });
    return Object.entries(months);
  }, [proposals]);

  const maxMonthly = Math.max(...monthlyActivity.map(([, v]) => v), 1);

  if (!user) return null;

  const userType = localStorage.getItem("type") || "";
  const isArtist = userType === "artista";
  const sectionTitle = isArtist ? "Propostas Recebidas" : "Propostas Enviadas";
  const recentProposals = proposals.slice(0, 8);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar
        isArtist={isArtist}
        activePage="dashboard"
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative overflow-y-auto scrollbar-hide">
        <Header
          user={user}
          userType={userType}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
        />

        <div className="p-6 lg:p-8 space-y-8">
          {/* ── Greeting Hero ── */}
          <section className="fade-in-up relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-linear-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-linear-to-br from-amber-400/10 via-rose-500/10 to-fuchsia-600/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-linear-to-tr from-emerald-500/8 to-cyan-500/5 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-zinc-800/80 px-3 py-1 text-[11px] font-semibold text-zinc-400 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isArtist ? "Painel do Artista" : "Painel do Contratante"}
                  </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight lg:text-4xl">
                  {getGreeting()},{" "}
                  <span className="bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {user.usuario}
                  </span>
                </h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
                  {isArtist
                    ? "Acompanhe suas propostas, mantenha seu perfil atualizado e conquiste novos palcos."
                    : "Gerencie suas contratações, descubra novos talentos e faça eventos memoráveis."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    router.push(isArtist ? "/profile" : "/explore")
                  }
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isArtist ? "Meu Perfil" : "Explorar Artistas"}
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
                <button
                  onClick={() => router.push("/proposals")}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-200 hover:border-zinc-600 hover:text-white"
                >
                  Ver todas propostas
                </button>
              </div>
            </div>
          </section>

          {/* ── Stats Grid ── */}
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Total"
              value={stats.total}
              icon="📊"
              accent="bg-blue-500"
              sub={sectionTitle.toLowerCase()}
              delay="0ms"
            />
            <StatCard
              label="Pendentes"
              value={stats.pendentes}
              icon="⏳"
              accent="bg-amber-500"
              sub="aguardando resposta"
              delay="60ms"
            />
            <StatCard
              label="Aceitas"
              value={stats.aceitas}
              icon="✅"
              accent="bg-emerald-500"
              sub={
                stats.valorTotal > 0
                  ? formatCurrency(stats.valorTotal)
                  : "nenhuma até agora"
              }
              delay="120ms"
            />
            <StatCard
              label="Recusadas"
              value={stats.recusadas}
              icon="❌"
              accent="bg-red-500"
              sub={
                stats.canceladas > 0
                  ? `+ ${stats.canceladas} cancelada${stats.canceladas > 1 ? "s" : ""}`
                  : undefined
              }
              delay="180ms"
            />
          </section>

          {/* ── Middle Row: Activity + Quick Actions ── */}
          <section className="grid gap-6 lg:grid-cols-3">
            <div
              className="fade-in-up lg:col-span-2 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6"
              style={{ animationDelay: "100ms" }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Atividade Recente
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Propostas nos últimos 6 meses
                  </p>
                </div>
                <span className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-400">
                  {new Date().getFullYear()}
                </span>
              </div>
              <div className="space-y-3">
                {monthlyActivity.map(([month, count]) => (
                  <ActivityBar
                    key={month}
                    label={month}
                    value={count}
                    max={maxMonthly}
                  />
                ))}
              </div>
            </div>

            <div
              className="fade-in-up rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6"
              style={{ animationDelay: "160ms" }}
            >
              <h3 className="mb-5 text-sm font-bold text-white">
                Ações Rápidas
              </h3>
              <div className="space-y-3">
                {isArtist ? (
                  <>
                    <QuickAction
                      icon="👤"
                      label="Editar perfil"
                      onClick={() => router.push("/profile")}
                    />
                    <QuickAction
                      icon="🔍"
                      label="Ver contratantes"
                      onClick={() => router.push("/explore")}
                    />
                    <QuickAction
                      icon="⚙️"
                      label="Configurações"
                      onClick={() => router.push("/settings")}
                    />
                  </>
                ) : (
                  <>
                    <QuickAction
                      icon="🎵"
                      label="Explorar artistas"
                      onClick={() => router.push("/explore")}
                    />
                    <QuickAction
                      icon="📝"
                      label="Minhas propostas"
                      onClick={() => router.push("/proposals")}
                    />
                    <QuickAction
                      icon="👤"
                      label="Meu perfil"
                      onClick={() => router.push("/profile")}
                    />
                    <QuickAction
                      icon="⚙️"
                      label="Configurações"
                      onClick={() => router.push("/settings")}
                    />
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ── Proposals Section ── */}
          <section className="fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{sectionTitle}</h2>
                <span className="rounded-full bg-linear-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-400 tabular-nums">
                  {proposals.length}
                </span>
              </div>
              {proposals.length > 8 && (
                <button
                  onClick={() => router.push("/proposals")}
                  className="text-xs font-semibold text-zinc-500 transition-colors hover:text-white"
                >
                  Ver todas →
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-2xl border border-zinc-800/40 bg-zinc-900/30"
                  />
                ))}
              </div>
            ) : proposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 py-16">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/60 text-3xl">
                  {isArtist ? "🎤" : "📋"}
                </div>
                <p className="mb-2 text-sm font-medium text-zinc-400">
                  Nenhuma proposta encontrada
                </p>
                <p className="mb-6 max-w-xs text-center text-xs text-zinc-600">
                  {isArtist
                    ? "Mantenha seu perfil completo e atualizado para atrair mais contratantes."
                    : "Explore nosso catálogo de artistas e envie sua primeira proposta."}
                </p>
                <button
                  onClick={() =>
                    router.push(isArtist ? "/profile" : "/explore")
                  }
                  className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isArtist ? "Atualizar Perfil" : "Explorar Artistas"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {recentProposals.map((item) => (
                  <ProposalCard
                    key={item.id_proposta}
                    item={item}
                    isArtist={isArtist}
                    onAcceptDecline={handleAcceptDecline}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
