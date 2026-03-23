"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Trash2,
  MoreHorizontal,
  Calendar,
  Search,
  Briefcase,
} from "lucide-react";
import { Post, api } from "@/lib/api";

const tipoLabel: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  disponibilidade: {
    label: "Disponível",
    icon: <Calendar size={12} />,
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  buscando: {
    label: "Buscando Artista",
    icon: <Search size={12} />,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "agora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onDelete?: (id: string) => void;
  onComment?: (post: Post) => void;
}

export default function PostCard({ post, currentUserId, onDelete, onComment }: PostCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.curtiu ?? false);
  const [likeCount, setLikeCount] = useState(post.curtidas_count);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = currentUserId === post.id_autor;
  const tipo = tipoLabel[post.tipo];

  const handleLike = async () => {
    try {
      if (liked) {
        await api.descurtirPost(post.id);
        setLiked(false);
        setLikeCount((c) => c - 1);
      } else {
        await api.curtirPost(post.id);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await api.deletePost(post.id);
      onDelete?.(post.id);
    } catch {}
    setShowMenu(false);
  };

  return (
    <div className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-zinc-700/60">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <div
          onClick={() => router.push(`/u/${post.autor.id}`)}
          className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer shrink-0 overflow-hidden"
        >
          {post.autor.image ? (
            <img src={post.autor.image} alt="" className="h-full w-full object-cover" />
          ) : (
            post.autor.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              onClick={() => router.push(`/u/${post.autor.id}`)}
              className="text-sm font-semibold text-white cursor-pointer hover:underline truncate"
            >
              {post.autor.name}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800/60 text-zinc-400">
              {post.autor.tipo_usuario === "artista" ? "Artista" : "Contratante"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span>{timeAgo(post.created_at)}</span>
            {post.cidade && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <MapPin size={10} />
                  {post.cidade}{post.estado ? `, ${post.estado}` : ""}
                </span>
              </>
            )}
          </div>
        </div>
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 z-10 w-36 rounded-xl border border-zinc-800/60 bg-zinc-900 shadow-xl p-1">
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 size={14} />
                  Excluir
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post type badge */}
      {tipo && (
        <div className="px-5 pb-2">
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${tipo.color}`}>
            {tipo.icon}
            {tipo.label}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="px-5 pb-3">
        <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">{post.conteudo}</p>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-medium text-rose-400/80 hover:text-rose-400 cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Images */}
      {post.imagens.length > 0 && (
        <div className={`px-5 pb-3 grid gap-1.5 ${
          post.imagens.length === 1 ? "grid-cols-1" :
          post.imagens.length === 2 ? "grid-cols-2" :
          post.imagens.length === 3 ? "grid-cols-2" : "grid-cols-2"
        }`}>
          {post.imagens.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-xl bg-zinc-800 ${
                post.imagens.length === 3 && i === 0 ? "row-span-2" : ""
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover aspect-square"
              />
              {i === 3 && post.imagens.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-lg">
                  +{post.imagens.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Video */}
      {post.video_url && (
        <div className="px-5 pb-3">
          <div className="overflow-hidden rounded-xl bg-zinc-800 aspect-video">
            {post.video_url.includes("youtube.com") || post.video_url.includes("youtu.be") ? (
              <iframe
                src={`https://www.youtube.com/embed/${
                  post.video_url.includes("youtu.be")
                    ? post.video_url.split("/").pop()
                    : new URL(post.video_url).searchParams.get("v")
                }`}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <video src={post.video_url} controls className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-5 py-3 border-t border-zinc-800/40">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 ${
            liked
              ? "text-rose-400 bg-rose-400/10"
              : "text-zinc-500 hover:text-rose-400 hover:bg-zinc-800/60"
          }`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
          <span className="text-[13px] font-medium">{likeCount || ""}</span>
        </button>

        <button
          onClick={() => onComment?.(post)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/60 transition-all duration-200"
        >
          <MessageCircle size={16} />
          <span className="text-[13px] font-medium">{post.comentarios_count || ""}</span>
        </button>

        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-fuchsia-400 hover:bg-zinc-800/60 transition-all duration-200">
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
}
