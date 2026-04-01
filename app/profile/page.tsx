"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, User } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import BackButton from "@/components/BackButton";
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
  Plus,
  X,
  Upload,
  ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ZoomIn,
} from "lucide-react";

// ─── Shared style helpers ────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50";
const labelClass = "mb-1.5 block text-[13px] font-medium text-zinc-400";

// ─── Portfolio types ─────────────────────────────────────────────────────────

interface PortfolioItem {
  id: string;
  user_id: string;
  url: string;
  titulo?: string;
  descricao?: string;
  created_at: string;
}

// ─── Portfolio API helpers ────────────────────────────────────────────────────

const fetchPortfolio = async (userId: string): Promise<PortfolioItem[]> => {
  const res = await fetch(`/api/portfolio/${userId}`);
  if (!res.ok) throw new Error("Erro ao carregar portfólio");
  return res.json();
};

const uploadPortfolioItem = async (
  userId: string,
  file: File,
  titulo?: string,
  descricao?: string
): Promise<PortfolioItem> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", userId);
  if (titulo) formData.append("titulo", titulo);
  if (descricao) formData.append("descricao", descricao);
  const res = await fetch(`/api/portfolio`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Erro ao enviar arquivo");
  return res.json();
};

const deletePortfolioItem = async (itemId: string): Promise<void> => {
  const res = await fetch(`/api/portfolio/item/${itemId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao remover item");
};

// ─── Portfolio sub-components ─────────────────────────────────────────────────

function PortfolioEmptyState({
  isOwner,
  onAdd,
}: {
  isOwner: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-zinc-700/60 bg-zinc-900/40">
        <ImageIcon size={32} className="text-zinc-600" />
      </div>
      <h3 className="text-base font-bold text-zinc-300">Portfólio vazio</h3>
      <p className="mt-2 max-w-xs text-sm text-zinc-600 leading-relaxed">
        {isOwner
          ? "Adicione fotos, artes e registros dos seus shows para impressionar contratantes."
          : "Este artista ainda não adicionou itens ao portfólio."}
      </p>
      {isOwner && (
        <button
          onClick={onAdd}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={15} /> Adicionar item
        </button>
      )}
    </div>
  );
}

function PortfolioUploadModal({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dragging, setDragging] = useState(false);

  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => uploadPortfolioItem(userId, file!, titulo, descricao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", userId] });
      onClose();
    },
  });

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }, []);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Adicionar item ao portfólio"
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Adicionar ao portfólio</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800/60 bg-zinc-900/50 text-zinc-500 transition-all hover:border-zinc-700 hover:text-white"
            aria-label="Fechar modal"
          >
            <X size={14} />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("portfolio-file-input")?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            document.getElementById("portfolio-file-input")?.click()
          }
          aria-label="Clique ou arraste uma imagem"
          className={`relative mb-4 flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 ${
            dragging
              ? "border-zinc-500 bg-zinc-800/40"
              : preview
              ? "border-zinc-700/60 bg-zinc-900/30"
              : "border-zinc-800/60 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
          }`}
        >
          {preview ? (
            <Image src={preview} alt="Preview" fill className="object-cover" />
          ) : (
            <>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/60 text-zinc-500">
                <Upload size={20} />
              </div>
              <p className="text-sm font-medium text-zinc-400">
                Clique ou arraste uma imagem
              </p>
              <p className="mt-1 text-xs text-zinc-600">PNG, JPG, WEBP até 10MB</p>
            </>
          )}
          <input
            id="portfolio-file-input"
            type="file"
            accept="image/*"
            className="hidden"
            aria-hidden="true"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título (ex: Show no Carioca Club)"
            className={inputClass}
            aria-label="Título do item"
          />
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição opcional..."
            rows={2}
            className={`${inputClass} resize-none`}
            aria-label="Descrição do item"
          />
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-400">{(error as Error).message}</p>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-800/60 bg-zinc-900/50 py-2.5 text-sm font-semibold text-zinc-400 transition-all hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={() => mutate()}
            disabled={!file || isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <Upload size={14} /> Publicar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function PortfolioLightbox({
  items,
  initialIndex,
  onClose,
  onDelete,
  isOwner,
}: {
  items: PortfolioItem[];
  initialIndex: number;
  onClose: () => void;
  onDelete: (id: string) => void;
  isOwner: boolean;
}) {
  const [index, setIndex] = useState(initialIndex);
  const item = items[index];

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Visualizar imagem do portfólio"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-900/80 text-zinc-400 backdrop-blur-sm transition-all hover:border-zinc-700 hover:text-white"
        aria-label="Fechar visualização"
      >
        <X size={16} />
      </button>

      {/* Delete — owner only */}
      {isOwner && (
        <button
          onClick={() => { onDelete(item.id); onClose(); }}
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-red-900/40 bg-zinc-900/80 text-red-400 backdrop-blur-sm transition-all hover:border-red-700/60 hover:text-red-300"
          aria-label="Remover item do portfólio"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Prev */}
      {items.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-900/80 text-zinc-400 backdrop-blur-sm transition-all hover:border-zinc-700 hover:text-white"
          aria-label="Imagem anterior"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Image + caption */}
      <div className="relative mx-16 flex max-h-[80vh] max-w-4xl w-full flex-col items-center gap-4">
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-zinc-800/40 bg-zinc-900/60"
          style={{ aspectRatio: "16/9" }}
        >
          <Image
            src={item.url}
            alt={item.titulo || "Item do portfólio"}
            fill
            className="object-contain"
            priority
          />
        </div>
        {(item.titulo || item.descricao) && (
          <div className="w-full rounded-xl border border-zinc-800/40 bg-zinc-900/60 px-5 py-3 backdrop-blur-sm">
            {item.titulo && (
              <p className="text-sm font-bold text-white">{item.titulo}</p>
            )}
            {item.descricao && (
              <p className="mt-0.5 text-sm text-zinc-400">{item.descricao}</p>
            )}
          </div>
        )}
        {items.length > 1 && (
          <p className="text-xs text-zinc-600">
            {index + 1} / {items.length}
          </p>
        )}
      </div>

      {/* Next */}
      {items.length > 1 && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-900/80 text-zinc-400 backdrop-blur-sm transition-all hover:border-zinc-700 hover:text-white"
          aria-label="Próxima imagem"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

function PortfolioTab({
  userId,
  isOwner,
}: {
  userId: string;
  isOwner: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["portfolio", userId],
    queryFn: () => fetchPortfolio(userId),
    staleTime: 1000 * 60 * 2,
  });

  const { mutate: deleteItem } = useMutation({
    mutationFn: deletePortfolioItem,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["portfolio", userId] }),
  });

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
        aria-label="Carregando portfólio"
      >
        {Array.from({ length: 6 }).map((_: unknown, i: number) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-2xl border border-zinc-800/40 bg-zinc-900/60"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        role="alert"
      >
        <p className="text-sm font-semibold text-red-400">
          Erro ao carregar portfólio.
        </p>
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["portfolio", userId] })
          }
          className="mt-3 text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-300"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      {items.length === 0 ? (
        <PortfolioEmptyState
          isOwner={isOwner}
          onAdd={() => setShowUpload(true)}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item: PortfolioItem, i: number) => (
            <button
              key={item.id}
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 transition-all duration-200 hover:border-zinc-700/60 hover:shadow-lg hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
              aria-label={item.titulo ? `Abrir ${item.titulo}` : `Abrir imagem ${i + 1}`}
            >
              <Image
                src={item.url}
                alt={item.titulo || `Portfólio item ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/50 group-hover:opacity-100">
                <ZoomIn size={22} className="text-white" />
                {item.titulo && (
                  <p className="mt-2 line-clamp-2 px-3 text-center text-xs font-semibold text-white">
                    {item.titulo}
                  </p>
                )}
              </div>
            </button>
          ))}

          {/* Add tile — owner only */}
          {isOwner && (
            <button
              onClick={() => setShowUpload(true)}
              className="group flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-800/60 bg-zinc-900/30 transition-all hover:border-zinc-700 hover:bg-zinc-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
              aria-label="Adicionar novo item ao portfólio"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/60 text-zinc-500 transition-colors group-hover:bg-zinc-700/60 group-hover:text-zinc-300">
                <Plus size={18} />
              </div>
              <span className="text-xs font-semibold text-zinc-600 transition-colors group-hover:text-zinc-400">
                Adicionar
              </span>
            </button>
          )}
        </div>
      )}

      {lightboxIndex !== null && (
        <PortfolioLightbox
          items={items}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onDelete={(id) => deleteItem(id)}
          isOwner={isOwner}
        />
      )}

      {showUpload && (
        <PortfolioUploadModal
          userId={userId}
          onClose={() => setShowUpload(false)}
        />
      )}
    </>
  );
}

// ─── Sub-components (profile) ─────────────────────────────────────────────────

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

// ─── Main page ────────────────────────────────────────────────────────────────

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
      </div>
    );
  }

  if (!user) return null;

  const isArtist = user.tipo_usuario === "artista";
  const isOwner = storeUser?.id === user.id;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -right-40 -top-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-120 w-120 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>

      {/* ── Sticky navbar ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <BackButton href="/dashboard" />
            <Link href="/" className="shrink-0">
              <span className="bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-xl font-black tracking-tight text-transparent">
                Music Connect
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="hidden items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white sm:inline-flex"
            >
              <BarChart2 size={14} /> Dashboard
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="hidden items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white sm:inline-flex"
            >
              <Settings size={14} /> Configurações
            </button>
            <div className="relative h-9 w-9 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-0.5 shadow-lg shadow-rose-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Banner ── */}
      <div className="relative">
        <div className="h-56 w-full overflow-hidden bg-linear-to-r from-zinc-950 via-zinc-900 to-zinc-950 sm:h-64">
          <div className="absolute inset-0 bg-linear-to-r from-amber-500/8 via-rose-500/8 to-fuchsia-500/8" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent" />
        </div>
      </div>

      {/* ── Profile header ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="fade-in-up -mt-20 flex flex-col items-center gap-6 border-b border-zinc-800/50 pb-8 sm:flex-row sm:items-end">
          {/* Avatar */}
          <div className="relative h-36 w-36 shrink-0 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-1 shadow-2xl shadow-rose-500/10">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-black bg-zinc-900 text-4xl font-bold text-white">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                user.name.substring(0, 2).toUpperCase()
              )}
            </div>
          </div>

          {/* Name + meta */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              {user.name}
            </h1>
            <p className="mt-1 text-sm capitalize text-zinc-500">
              {user.tipo_usuario}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
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

          {/* Edit button — owner only */}
          {isOwner && (
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
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── Left column ── */}
          <div className="space-y-6 lg:col-span-1">
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:scale-[1.01] hover:shadow-white/10 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
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
                  <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-zinc-400">
                    {user.descricao || "Adicione uma descrição ao seu perfil."}
                  </p>
                  <div className="space-y-2">
                    <InfoItem
                      icon={<Mail size={14} />}
                      label="Email"
                      value={user.email}
                    />
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

            {/* Social links */}
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
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition-all hover:bg-zinc-800/40 hover:text-emerald-400"
                    >
                      <Headphones size={14} /> Spotify
                    </a>
                  )}
                  {user.instagram_url && (
                    <a
                      href={user.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition-all hover:bg-zinc-800/40 hover:text-rose-400"
                    >
                      <Instagram size={14} /> Instagram
                    </a>
                  )}
                  {user.youtube_url && (
                    <a
                      href={user.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition-all hover:bg-zinc-800/40 hover:text-red-400"
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

          {/* ── Right column ── */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div
              className="fade-in-up mb-8 flex w-fit gap-1 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-1"
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

            {/* ── Sobre tab ── */}
            {activeTab === "sobre" && (
              <div
                className="fade-in-up space-y-6"
                style={{ animationDelay: "160ms" }}
              >
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm">
                  <p className="text-sm leading-relaxed text-zinc-400">
                    Esta é a página de perfil de{" "}
                    <strong className="text-white">{user.name}</strong>.
                    Adicione mais informações editando o perfil.
                  </p>
                </div>

                {isArtist && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
                        <span className="mb-2 block text-zinc-400">
                          {stat.icon}
                        </span>
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

            {/* ── Portfolio tab ── */}
            {activeTab === "portfolio" && (
              <div
                className="fade-in-up"
                style={{ animationDelay: "160ms" }}
              >
                <PortfolioTab userId={user.id} isOwner={isOwner} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}