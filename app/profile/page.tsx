"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, User } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { authClient } from "@/lib/auth-client";
import BackButton from "@/components/BackButton";
import { ProfileSkeleton } from "@/components/Skeleton";
import {
  BarChart2,
  Settings,
  Mail,
  Smartphone,
  MapPin,
  Music,
  DollarSign,
  Gem,
  Headphones,
  Instagram,
  Youtube,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50";
const labelClass = "mb-1.5 block text-[13px] font-medium text-zinc-400";

export default function ProfilePage() {
  const router = useRouter();
  const { user: storeUser, sessionLoaded } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sobre" | "portfolio">("sobre");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    descricao: "",
    telefone: "",
    cidade: "",
    estado: "",
    genero_musical: "",
  });

  useEffect(() => {
    if (!sessionLoaded) return;
    if (!storeUser) {
      router.push("/login");
      return;
    }

    const loadUser = async () => {
      try {
        const freshUserData = await api.getUserById(storeUser.id);
        setUser(freshUserData);
        setEditForm({
          descricao: freshUserData.descricao || "",
          telefone: freshUserData.telefone || "",
          cidade: freshUserData.cidade || "",
          estado: freshUserData.estado || "",
          genero_musical: freshUserData.genero_musical || "",
        });
      } catch (error: unknown) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [storeUser, sessionLoaded, router]);

  const handleSave = async () => {
    if (!user || !storeUser) return;
    setSaving(true);
    try {
      const updatedUser = await api.updateUser(storeUser.id, editForm);
      setUser(updatedUser);
      setIsEditing(false);
    } catch {
      alert("Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) return null;

  const isArtist = user.tipo_usuario === "artista";

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
          <div className="flex items-center gap-3">
            <BackButton href="/dashboard" />
            <Link href="/" className="shrink-0">
              <span className="text-xl font-black tracking-tight bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                Music Connect
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
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
                {user.name
                  ? user.name.substring(0, 2).toUpperCase()
                  : "U"}
              </div>
            </div>
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
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                user.name.substring(0, 2).toUpperCase()
              )}
            </div>
          </div>

          {/* Name + meta */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {user.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 capitalize">
              {user.tipo_usuario}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              {user.genero_musical && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                  <Music size={12} /> {user.genero_musical}
                </span>
              )}
              {user.cidade && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-800/60 bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-500">
                  <MapPin size={12} /> {user.cidade}
                  {user.estado && `, ${user.estado}`}
                </span>
              )}
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
              isEditing
                ? "border border-zinc-800/60 bg-zinc-900/50 text-zinc-300 hover:text-white"
                : "bg-white text-black shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column — info card ── */}
          <div className="lg:col-span-1 space-y-6">
            <div
              className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm"
              style={{ animationDelay: "80ms" }}
            >
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                Sobre
                <span className="h-px flex-1 bg-zinc-800/60" />
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Descrição</label>
                    <textarea
                      value={editForm.descricao}
                      onChange={(e) =>
                        setEditForm({ ...editForm, descricao: e.target.value })
                      }
                      placeholder="Fale sobre você..."
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Telefone</label>
                    <input
                      type="text"
                      value={editForm.telefone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, telefone: e.target.value })
                      }
                      placeholder="(11) 99999-9999"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Cidade</label>
                      <input
                        type="text"
                        value={editForm.cidade}
                        onChange={(e) =>
                          setEditForm({ ...editForm, cidade: e.target.value })
                        }
                        placeholder="São Paulo"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Estado</label>
                      <input
                        type="text"
                        value={editForm.estado}
                        onChange={(e) =>
                          setEditForm({ ...editForm, estado: e.target.value })
                        }
                        placeholder="SP"
                        maxLength={2}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  {isArtist && (
                    <div>
                      <label className={labelClass}>Gênero Musical</label>
                      <select
                        value={editForm.genero_musical}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            genero_musical: e.target.value,
                          })
                        }
                        className={inputClass}
                      >
                        <option value="">Selecione</option>
                        {[
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
                        ].map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {saving ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6 whitespace-pre-line">
                    {user.descricao || "Adicione uma descrição ao seu perfil."}
                  </p>
                  <div className="space-y-2">
                    <InfoItem icon={<Mail size={14} />} label="Email" value={user.email} />
                    {user.telefone && (
                      <InfoItem
                        icon={<Smartphone size={14} />}
                        label="Telefone"
                        value={user.telefone}
                      />
                    )}
                    {user.cidade && (
                      <InfoItem
                        icon={<MapPin size={14} />}
                        label="Local"
                        value={`${user.cidade}${user.estado ? `, ${user.estado}` : ""}`}
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Social links placeholder */}
            {isArtist && (
              <div
                className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm"
                style={{ animationDelay: "160ms" }}
              >
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                  Links
                  <span className="h-px flex-1 bg-zinc-800/60" />
                </h3>
                <div className="space-y-2">
                  {user.spotify_url && (
                    <a
                      href={user.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800/40 hover:text-emerald-400 transition-all"
                    >
                      <Headphones size={14} /> Spotify
                    </a>
                  )}
                  {user.instagram_url && (
                    <a
                      href={user.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800/40 hover:text-rose-400 transition-all"
                    >
                      <Instagram size={14} /> Instagram
                    </a>
                  )}
                  {user.youtube_url && (
                    <a
                      href={user.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800/40 hover:text-red-400 transition-all"
                    >
                      <Youtube size={14} /> YouTube
                    </a>
                  )}
                  {!user.spotify_url &&
                    !user.instagram_url &&
                    !user.youtube_url && (
                      <p className="text-xs text-zinc-600">
                        Nenhum link adicionado.
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column — tabs ── */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div
              className="fade-in-up mb-8 flex gap-1 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-1 w-fit"
              style={{ animationDelay: "80ms" }}
            >
              {(["sobre", "portfolio"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-zinc-800/80 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab === "sobre" ? "Sobre" : "Portfólio"}
                </button>
              ))}
            </div>

            {activeTab === "sobre" && (
              <div
                className="fade-in-up space-y-6"
                style={{ animationDelay: "160ms" }}
              >
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm">
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Esta é a página de perfil de{" "}
                    <strong className="text-white">{user.name}</strong>.
                    Adicione mais informações editando o perfil.
                  </p>
                </div>

                {/* Stats */}
                {isArtist && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Gênero",
                        value: user.genero_musical || "—",
                        icon: <Music size={18} />,
                      },
                      {
                        label: "Preço Mín.",
                        value: user.preco_minimo
                          ? `R$ ${user.preco_minimo}`
                          : "—",
                        icon: <DollarSign size={18} />,
                      },
                      {
                        label: "Preço Máx.",
                        value: user.preco_maximo
                          ? `R$ ${user.preco_maximo}`
                          : "—",
                        icon: <Gem size={18} />,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 backdrop-blur-sm"
                      >
                        <span className="mb-2 block text-zinc-400">{stat.icon}</span>
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
              </div>
            )}

            {activeTab === "portfolio" && (
              <div
                className="fade-in-up space-y-4"
                style={{ animationDelay: "160ms" }}
              >
                <p className="text-sm text-zinc-500">
                  Adicione seus trabalhos e projetos aqui.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="group aspect-square cursor-pointer rounded-2xl border border-dashed border-zinc-800/60 bg-zinc-900/30 flex items-center justify-center transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
                    >
                      <span className="text-2xl text-zinc-700 group-hover:text-zinc-500 transition-colors">
                        +
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-zinc-800/30">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/60 text-zinc-400">
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
