"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, User } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

const inputClass =
  "w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50";
const labelClass = "mb-1.5 block text-[13px] font-medium text-zinc-400";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    descricao: "",
    local_evento: "",
    data_evento: "",
    valor: "",
  });

  /* Auth state — optional, never blocks rendering */
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await api.getUserById(userId);
        setProfileUser(user);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleSendProposal = async () => {
    if (!currentUser || !profileUser) return;
    setSending(true);
    try {
      await api.createProposta({
        id_contratante: currentUser.id,
        id_artista: profileUser.id,
        descricao: proposalForm.descricao,
        local_evento: proposalForm.local_evento,
        data_evento: proposalForm.data_evento,
        status: "pendente",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      setShowModal(false);
      setProposalForm({
        descricao: "",
        local_evento: "",
        data_evento: "",
        valor: "",
      });
    } catch {
      alert("Erro ao enviar proposta");
    } finally {
      setSending(false);
    }
  };

  const isLoggedIn = !!currentUser;
  const isArtistProfile = profileUser?.tipo_usuario === "artista";
  const isContractor = currentUser?.tipo_usuario === "contratante";
  const isOwnProfile = currentUser?.id === profileUser?.id;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
      </div>
    );
  }

  /* ── Not found ── */
  if (!profileUser) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-red-600/6 to-transparent blur-3xl" />
        </div>
        <div className="relative z-10 w-full max-w-md px-6 py-12 text-center">
          <div className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-10 backdrop-blur-sm">
            <span className="mb-4 block text-4xl">😕</span>
            <h1 className="mb-2 text-xl font-bold text-white">
              Usuário não encontrado
            </h1>
            <p className="mb-8 text-sm text-zinc-500">
              O perfil que você procura não existe ou foi removido.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Explorar Artistas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-120 w-120 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>

      {/* ── Sticky navbar ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="shrink-0">
            <span className="text-xl font-black tracking-tight bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
              Music Connect
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => router.push("/explore")}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
                >
                  🔍 Explorar
                </button>
                <div className="relative h-9 w-9 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-0.5 shadow-lg shadow-rose-500/10">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                    {currentUser.name
                      ? currentUser.name.substring(0, 2).toUpperCase()
                      : "U"}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/explore"
                  className="hidden sm:inline-flex rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
                >
                  🔍 Explorar
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
                >
                  Entrar
                </Link>
                <Link
                  href="/profile-selector"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Banner ── */}
      <div className="relative">
        <div className="h-56 sm:h-64 w-full overflow-hidden bg-linear-to-r from-zinc-950 via-zinc-900 to-zinc-950">
          <div className="absolute inset-0 bg-linear-to-r from-amber-500/8 via-rose-500/8 to-fuchsia-500/8" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-black to-transparent" />
        </div>
      </div>

      {/* ── Profile header ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="fade-in-up -mt-20 flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8 border-b border-zinc-800/50">
          {/* Avatar */}
          <div className="relative h-36 w-36 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-1 shadow-2xl shadow-rose-500/10 shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-4xl font-bold text-white border-4 border-black overflow-hidden">
              {profileUser.image ? (
                <Image
                  src={profileUser.image}
                  alt={profileUser.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                profileUser.name.substring(0, 2).toUpperCase()
              )}
            </div>
          </div>

          {/* Name + meta */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {profileUser.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 capitalize">
              {profileUser.tipo_usuario}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              {profileUser.genero_musical && (
                <span className="inline-flex items-center rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                  🎵 {profileUser.genero_musical}
                </span>
              )}
              {profileUser.cidade && (
                <span className="inline-flex items-center rounded-lg border border-zinc-800/60 bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-500">
                  📍 {profileUser.cidade}
                  {profileUser.estado && `, ${profileUser.estado}`}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {isOwnProfile && (
              <button
                onClick={() => router.push("/profile")}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Editar Perfil
              </button>
            )}
            {isContractor && isArtistProfile && !isOwnProfile && (
              <button
                onClick={() => setShowModal(true)}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Enviar Proposta
              </button>
            )}
            {!isLoggedIn && isArtistProfile && (
              <Link
                href="/login"
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
              >
                Entrar para Contratar
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column ── */}
          <div className="lg:col-span-1 space-y-6">
            {/* About card */}
            <div
              className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm"
              style={{ animationDelay: "80ms" }}
            >
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                Sobre
                <span className="h-px flex-1 bg-zinc-800/60" />
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6 whitespace-pre-line">
                {profileUser.descricao || "Nenhuma descrição disponível."}
              </p>
              <div className="space-y-2">
                <InfoItem icon="📧" label="Email" value={profileUser.email} />
                {profileUser.telefone && (
                  <InfoItem
                    icon="📱"
                    label="Telefone"
                    value={profileUser.telefone}
                  />
                )}
                {profileUser.cidade && (
                  <InfoItem
                    icon="📍"
                    label="Local"
                    value={`${profileUser.cidade}${profileUser.estado ? `, ${profileUser.estado}` : ""}`}
                  />
                )}
              </div>
            </div>

            {/* Social links */}
            {isArtistProfile &&
              (profileUser.spotify_url ||
                profileUser.instagram_url ||
                profileUser.youtube_url) && (
                <div
                  className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm"
                  style={{ animationDelay: "160ms" }}
                >
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                    Links
                    <span className="h-px flex-1 bg-zinc-800/60" />
                  </h3>
                  <div className="space-y-2">
                    {profileUser.spotify_url && (
                      <a
                        href={profileUser.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800/40 hover:text-emerald-400 transition-all"
                      >
                        🎧 Spotify
                      </a>
                    )}
                    {profileUser.instagram_url && (
                      <a
                        href={profileUser.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800/40 hover:text-rose-400 transition-all"
                      >
                        📸 Instagram
                      </a>
                    )}
                    {profileUser.youtube_url && (
                      <a
                        href={profileUser.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800/40 hover:text-red-400 transition-all"
                      >
                        🎬 YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}

            {/* Logged-in quick links */}
            {isLoggedIn && !isOwnProfile && (
              <div
                className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm"
                style={{ animationDelay: "240ms" }}
              >
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                  Atalhos
                  <span className="h-px flex-1 bg-zinc-800/60" />
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => router.push("/explore")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300 transition-all"
                  >
                    🔍 Explorar
                  </button>
                  <button
                    onClick={() => router.push("/proposals")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300 transition-all"
                  >
                    📄 Propostas
                  </button>
                  <button
                    onClick={() => router.push("/profile")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300 transition-all"
                  >
                    👤 Meu Perfil
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2">
            <div className="fade-in-up" style={{ animationDelay: "80ms" }}>
              <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-white">
                Portfólio / Destaques
                <span className="h-px flex-1 bg-zinc-800/60" />
              </h3>

              {/* Stats for artists */}
              {isArtistProfile && (
                <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Gênero",
                      value: profileUser.genero_musical || "—",
                      icon: "🎵",
                    },
                    {
                      label: "Preço Mín.",
                      value: profileUser.preco_minimo
                        ? `R$ ${profileUser.preco_minimo}`
                        : "—",
                      icon: "💰",
                    },
                    {
                      label: "Preço Máx.",
                      value: profileUser.preco_maximo
                        ? `R$ ${profileUser.preco_maximo}`
                        : "—",
                      icon: "💎",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 backdrop-blur-sm"
                    >
                      <span className="mb-2 block text-lg">{stat.icon}</span>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Media grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-2xl border border-dashed border-zinc-800/60 bg-zinc-900/30 flex items-center justify-center text-zinc-700"
                  >
                    Mídia do Usuário
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA for visitors ── */}
      {!isLoggedIn && (
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-8 sm:p-12 text-center backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Gostou deste perfil?
            </h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
              Crie sua conta para enviar propostas, avaliar artistas e muito
              mais.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/profile-selector"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Conta Grátis
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Proposal Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="fade-in-up w-full max-w-lg rounded-2xl border border-zinc-800/50 bg-zinc-900/80 p-8 backdrop-blur-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Enviar Proposta</h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800/60 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Local do Evento *</label>
                <input
                  type="text"
                  value={proposalForm.local_evento}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      local_evento: e.target.value,
                    })
                  }
                  placeholder="Ex: Bar do João, São Paulo"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Data do Evento *</label>
                <input
                  type="date"
                  value={proposalForm.data_evento}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      data_evento: e.target.value,
                    })
                  }
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Valor (R$) *</label>
                <input
                  type="number"
                  value={proposalForm.valor}
                  onChange={(e) =>
                    setProposalForm({ ...proposalForm, valor: e.target.value })
                  }
                  placeholder="1500"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Descrição</label>
                <textarea
                  value={proposalForm.descricao}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      descricao: e.target.value,
                    })
                  }
                  placeholder="Detalhes sobre o evento..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSendProposal}
                  disabled={sending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {sending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Proposta"
                  )}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-zinc-800/60 bg-zinc-900/50 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-zinc-800/30">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/60 text-sm">
        {icon}
      </div>
      <div className="min-w-0 overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
          {label}
        </p>
        <p className="truncate text-sm text-zinc-300">{value}</p>
      </div>
    </div>
  );
}
