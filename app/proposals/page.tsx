"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ProposalCard from "@/components/ProposalCard";
import BackButton from "@/components/BackButton";
import { api, Proposta } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { authClient } from "@/lib/auth-client";
import {
  BarChart2,
  Hourglass,
  CheckCircle2,
  XCircle,
  Mic,
  ClipboardList,
  Search,
  ArrowRight,
} from "lucide-react";

type Filter = "todas" | "pendente" | "aceita" | "recusada" | "cancelada";

const filterLabels: Record<Filter, string> = {
  todas: "Todas",
  pendente: "Pendentes",
  aceita: "Aceitas",
  recusada: "Recusadas",
  cancelada: "Canceladas",
};

const filterColors: Record<Filter, string> = {
  todas: "bg-zinc-800/80 text-white",
  pendente: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  aceita: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  recusada: "bg-red-500/15 border-red-500/30 text-red-400",
  cancelada: "bg-zinc-700/40 border-zinc-700/60 text-zinc-500",
};

export default function ProposalsPage() {
  const router = useRouter();
  const { user, sessionLoaded } = useAuthStore();
  const [proposals, setProposals] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Filter>("todas");

  useEffect(() => {
    if (!sessionLoaded) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const loadProposals = async () => {
      try {
        const isArtist = user.tipo_usuario === "artista";
        const [recebidas, enviadas] = await Promise.all([
          isArtist ? api.getPropostasRecebidas() : Promise.resolve([]),
          !isArtist ? api.getPropostasEnviadas() : Promise.resolve([]),
        ]);

        const all = [...recebidas, ...enviadas].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setProposals(all);
      } catch (error: unknown) {
        console.error("Erro ao carregar propostas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, [user, sessionLoaded, router]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleAcceptDecline = async (id: number, status: string) => {
    try {
      await api.updatePropostaStatus(id, status);
      setProposals((prev) =>
        prev.map((p) =>
          p.id_proposta === id
            ? { ...p, status: status as Proposta["status"] }
            : p,
        ),
      );
    } catch {
      alert("Erro ao atualizar status.");
    }
  };

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total: proposals.length,
    pendente: proposals.filter((p) => p.status === "pendente").length,
    aceita: proposals.filter((p) => p.status === "aceita").length,
    recusada: proposals.filter((p) => p.status === "recusada").length,
    cancelada: proposals.filter((p) => p.status === "cancelada").length,
    valorTotal: proposals
      .filter((p) => p.status === "aceita")
      .reduce((s, p) => s + (p.valor_oferecido || 0), 0),
  }), [proposals]);

  const filtered = useMemo(
    () =>
      activeFilter === "todas"
        ? proposals
        : proposals.filter((p) => p.status === activeFilter),
    [proposals, activeFilter],
  );

  if (!sessionLoaded || !user) return null;

  const isArtist = user.tipo_usuario === "artista";
  const pageTitle = isArtist ? "Propostas Recebidas" : "Minhas Contratações";

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar isArtist={isArtist} activePage="proposals" onLogout={handleLogout} />

      <main className="flex-1 flex flex-col relative overflow-y-auto scrollbar-hide">
        <div className="p-6 lg:p-8 space-y-8">

          {/* ── Page Header ── */}
          <section className="fade-in-up">
            <div className="mb-4">
              <BackButton href="/dashboard" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                  {pageTitle}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {isArtist
                    ? "Gerencie as propostas enviadas por contratantes"
                    : "Acompanhe suas contratações e propostas enviadas"}
                </p>
              </div>
              {!isArtist && (
                <button
                  onClick={() => router.push("/explore")}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Contratar Artista
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5"><ArrowRight size={14} /></span>
                </button>
              )}
            </div>
          </section>

          {/* ── Stats Row ── */}
          <section
            className="fade-in-up grid grid-cols-2 gap-4 lg:grid-cols-4"
            style={{ animationDelay: "60ms" }}
          >
            {[
              { label: "Total", value: stats.total, icon: <BarChart2 size={20} />, color: "bg-blue-500" },
              { label: "Pendentes", value: stats.pendente, icon: <Hourglass size={20} />, color: "bg-amber-500" },
              { label: "Aceitas", value: stats.aceita, icon: <CheckCircle2 size={20} />, sub: stats.valorTotal > 0 ? formatCurrency(stats.valorTotal) : undefined, color: "bg-emerald-500" },
              { label: "Recusadas", value: stats.recusada, icon: <XCircle size={20} />, sub: stats.cancelada > 0 ? `+${stats.cancelada} cancelada${stats.cancelada > 1 ? "s" : ""}` : undefined, color: "bg-red-500" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-zinc-700/80 hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-[0.08] transition-opacity duration-500 group-hover:opacity-20 ${stat.color}`} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-white tracking-tight tabular-nums">{stat.value}</p>
                    {stat.sub && <p className="mt-1.5 text-[11px] text-zinc-500">{stat.sub}</p>}
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-400 shrink-0">{stat.icon}</span>
                </div>
              </div>
            ))}
          </section>

          {/* ── Filter Tabs ── */}
          <section className="fade-in-up" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center gap-2 flex-wrap">
              {(Object.keys(filterLabels) as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    activeFilter === f
                      ? filterColors[f] + " border-transparent shadow-sm"
                      : "border-zinc-800/60 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {filterLabels[f]}
                  {f !== "todas" && stats[f] > 0 && (
                    <span className="ml-1.5 tabular-nums opacity-70">({stats[f]})</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ── Proposals Grid ── */}
          <section className="fade-in-up" style={{ animationDelay: "160ms" }}>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-2xl border border-zinc-800/40 bg-zinc-900/30"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 py-20">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/60 text-zinc-400">
                  {activeFilter === "todas" ? (isArtist ? <Mic size={32} /> : <ClipboardList size={32} />) : <Search size={32} />}
                </div>
                <p className="mb-2 text-sm font-medium text-zinc-400">
                  {activeFilter === "todas"
                    ? "Nenhuma proposta encontrada"
                    : `Nenhuma proposta ${filterLabels[activeFilter].toLowerCase()}`}
                </p>
                <p className="mb-6 max-w-xs text-center text-xs text-zinc-600">
                  {activeFilter !== "todas"
                    ? "Tente outro filtro para ver mais resultados."
                    : isArtist
                    ? "Mantenha seu perfil completo para atrair mais contratantes."
                    : "Explore artistas e envie sua primeira proposta."}
                </p>
                {activeFilter !== "todas" ? (
                  <button
                    onClick={() => setActiveFilter("todas")}
                    className="rounded-full border border-zinc-800/60 bg-zinc-900/50 px-5 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
                  >
                    Ver todas
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(isArtist ? "/profile" : "/explore")}
                    className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isArtist ? "Atualizar Perfil" : "Explorar Artistas"}
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  {filtered.length} {filtered.length === 1 ? "proposta" : "propostas"}
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((item) => (
                    <ProposalCard
                      key={item.id_proposta}
                      item={item}
                      isArtist={isArtist}
                      onAcceptDecline={handleAcceptDecline}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
