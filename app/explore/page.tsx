"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, User } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import BackButton from "@/components/BackButton";
import {
  Search,
  BarChart2,
  Settings,
  Users,
  Music,
  Building2,
  User as UserIcon,
  FileText,
  MapPin,
  X,
  ArrowRight,
} from "lucide-react";

const genres = [
  "Rock",
  "Pop",
  "Sertanejo",
  "Eletrônica",
  "MPB",
  "Jazz",
  "Funk",
  "Forró",
  "Hip Hop",
  "Indie",
];
const types = ["Todos", "Artistas", "Contratantes"];

/* ── Skeleton card for loading state ── */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-800/40 bg-zinc-900/30 p-4">
      <div className="aspect-square rounded-xl bg-zinc-800/60 mb-4" />
      <div className="h-4 w-3/4 rounded bg-zinc-800/60 mb-2" />
      <div className="h-3 w-1/2 rounded bg-zinc-800/40 mb-3" />
      <div className="h-5 w-16 rounded bg-zinc-800/40" />
    </div>
  );
}

/* ── Main explore content (needs Suspense for useSearchParams) ── */
function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [mobileFilters, setMobileFilters] = useState(false);

  /* Auth state — optional, never blocks rendering */
  const currentUser = useAuthStore((s) => s.user);

  /* Fetch users (public endpoint) */
  const fetchUsers = async (term: string) => {
    setLoading(true);
    try {
      const users = await api.getUsers(term);
      setResults(users);
    } catch (error) {
      console.error("Erro ao buscar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchTerm(initialSearch);
    fetchUsers(initialSearch);
  }, [initialSearch]);

  const handleSearch = () => {
    router.push(`/explore?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleGenre = (g: string) =>
    setSelectedGenre((prev) => (prev === g ? null : g));

  /* Filtering */
  const filteredResults = results.filter((user) => {
    if (selectedType === "Artistas" && user.tipo_usuario !== "artista")
      return false;
    if (selectedType === "Contratantes" && user.tipo_usuario !== "contratante")
      return false;
    if (
      selectedGenre &&
      user.genero_musical?.toLowerCase() !== selectedGenre.toLowerCase()
    )
      return false;
    return true;
  });

  const isLoggedIn = !!currentUser;

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-120 w-120 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>

      {/* ── Top navbar ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <BackButton href={isLoggedIn ? "/dashboard" : "/"} />
            <Link href="/">
              <span className="text-xl font-black tracking-tight bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                Music Connect
              </span>
            </Link>
          </div>

          {/* Search — centered */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-6">
            <div className="group relative w-full">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-zinc-300">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Buscar por nome, gênero, cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKey}
                className="w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
                >
                  <BarChart2 size={14} /> Dashboard
                </button>
                <button
                  onClick={() => router.push("/settings")}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
                >
                  <Settings size={14} /> Configurações
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

        {/* Mobile search */}
        <div className="sm:hidden px-4 pb-3">
          <div className="group relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKey}
              className="w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/50"
            />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-7xl gap-0 lg:gap-8 px-4 py-6 sm:px-6 sm:py-8">
        {/* ── Sidebar filters — desktop ── */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24 space-y-8">
            {/* Type filter */}
            <div>
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Tipo
              </h3>
              <div className="space-y-1">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      selectedType === type
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300"
                    }`}
                  >
                    <span className="flex items-center">
                      {type === "Todos"
                        ? <Users size={16} />
                        : type === "Artistas"
                          ? <Music size={16} />
                          : <Building2 size={16} />}
                    </span>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre filter */}
            <div>
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Gênero Musical
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                      selectedGenre === g
                        ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                        : "border-zinc-800/60 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {selectedGenre && (
                <button
                  onClick={() => setSelectedGenre(null)}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  <X size={10} /> Limpar gênero
                </button>
              )}
            </div>

            {/* Logged-in quick links */}
            {isLoggedIn && (
              <div>
                <div className="h-px bg-linear-to-r from-transparent via-zinc-800/60 to-transparent mb-6" />
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Atalhos
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => router.push("/profile")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300 transition-all"
                  >
                    <UserIcon size={14} /> Meu Perfil
                  </button>
                  <button
                    onClick={() => router.push("/proposals")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300 transition-all"
                  >
                    <FileText size={14} /> Propostas
                  </button>
                  <button
                    onClick={() => router.push("/settings")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300 transition-all"
                  >
                    <Settings size={14} /> Configurações
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {/* Hero heading */}
          <div className="fade-in-up mb-8">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Explorar
            </h1>
            <p className="text-sm text-zinc-500">
              Descubra artistas e contratantes na plataforma
            </p>
          </div>

          {/* Mobile filter toggle + pills */}
          <div className="lg:hidden mb-6 space-y-3">
            <button
              onClick={() => setMobileFilters(!mobileFilters)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:border-zinc-700 hover:text-white"
            >
              <Settings size={14} /> Filtros
              {(selectedType !== "Todos" || selectedGenre) && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-400">
                  {(selectedType !== "Todos" ? 1 : 0) + (selectedGenre ? 1 : 0)}
                </span>
              )}
            </button>

            {mobileFilters && (
              <div className="space-y-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 backdrop-blur-sm">
                {/* Type */}
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        selectedType === type
                          ? "border-white/20 bg-white/10 text-white"
                          : "border-zinc-800/60 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {/* Genres */}
                <div className="flex flex-wrap gap-1.5">
                  {genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                        selectedGenre === g
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                          : "border-zinc-800/60 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active filters */}
          {(selectedType !== "Todos" || selectedGenre) && (
            <div className="fade-in-up mb-6 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Filtros:
              </span>
              {selectedType !== "Todos" && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-800/60 bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-400">
                  {selectedType}
                  <button
                    onClick={() => setSelectedType("Todos")}
                    className="ml-0.5 text-zinc-600 hover:text-white"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-400">
                  {selectedGenre}
                  <button
                    onClick={() => setSelectedGenre(null)}
                    className="ml-0.5 text-rose-600 hover:text-rose-300"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Results count */}
          {!loading && (
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
              {filteredResults.length}{" "}
              {filteredResults.length === 1 ? "resultado" : "resultados"}
            </p>
          )}

          {/* ── Results grid ── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="fade-in-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/60 bg-zinc-900/20 py-20 text-center">
              <span className="mb-4 text-zinc-500"><Search size={40} /></span>
              <p className="text-zinc-400 font-medium mb-1">
                Nenhum resultado encontrado
              </p>
              <p className="text-sm text-zinc-600 max-w-xs">
                Tente termos mais genéricos ou limpe os filtros aplicados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredResults.map((user, i) => (
                <div
                  key={user.id}
                  onClick={() => router.push(`/u/${user.id}`)}
                  className="fade-in-up group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700/80 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
                  style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-rose-500/0 blur-3xl transition-all duration-500 group-hover:bg-rose-500/6" />

                  {/* Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-zinc-800/60">
                    <div className="absolute inset-0 bg-linear-to-br from-zinc-800/80 to-zinc-900 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="opacity-60 text-zinc-500">
                          {user.tipo_usuario === "artista" ? <Music size={48} /> : <Building2 size={48} />}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="relative">
                    <h3 className="font-bold text-white text-base mb-0.5 truncate group-hover:text-white/90">
                      {user.name}
                    </h3>
                    <p className="text-xs text-zinc-500 capitalize mb-2.5">
                      {user.tipo_usuario}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {user.genero_musical && (
                        <span className="inline-flex items-center rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-400">
                          {user.genero_musical}
                        </span>
                      )}
                      {user.cidade && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-600">
                          <MapPin size={10} /> {user.cidade}
                          {user.estado && `, ${user.estado}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow on hover */}
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/60 text-zinc-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-white">
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* CTA for visitors */}
      {!isLoggedIn && !loading && filteredResults.length > 0 && (
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-8 sm:p-12 text-center backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Faça parte da comunidade
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
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
