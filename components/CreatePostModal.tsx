"use client";

import { useState } from "react";
import { X, Image, Film, Hash, MapPin, Send } from "lucide-react";
import { api } from "@/lib/api";

interface CreatePostModalProps {
  onClose: () => void;
  onCreated: () => void;
  userName?: string;
}

export default function CreatePostModal({ onClose, onCreated, userName }: CreatePostModalProps) {
  const [conteudo, setConteudo] = useState("");
  const [tipo, setTipo] = useState<"post" | "disponibilidade" | "buscando">("post");
  const [imagemUrl, setImagemUrl] = useState("");
  const [imagens, setImagens] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const addImage = () => {
    if (imagemUrl && imagens.length < 10) {
      setImagens([...imagens, imagemUrl]);
      setImagemUrl("");
    }
  };

  const removeImage = (i: number) => {
    setImagens(imagens.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!conteudo.trim()) return;
    setLoading(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      await api.createPost({
        conteudo: conteudo.trim(),
        tipo,
        imagens: imagens.length > 0 ? imagens : undefined,
        video_url: videoUrl || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      onCreated();
    } catch {
      alert("Erro ao criar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800/60 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/50">
          <h2 className="text-base font-bold text-white">Criar publicação</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Post type */}
          <div className="flex gap-2">
            {[
              { value: "post", label: "Post" },
              { value: "disponibilidade", label: "Disponível" },
              { value: "buscando", label: "Buscando Artista" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTipo(opt.value as any)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  tipo === opt.value
                    ? "border-rose-400/40 bg-rose-400/10 text-rose-400"
                    : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder={
              tipo === "disponibilidade"
                ? "Conte sobre sua disponibilidade..."
                : tipo === "buscando"
                ? "Descreva o artista que você está buscando..."
                : "O que você quer compartilhar?"
            }
            rows={4}
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-zinc-800/60 bg-zinc-800/30 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
          <p className="text-right text-[10px] text-zinc-600">{conteudo.length}/2000</p>

          {/* Tags */}
          <div className="relative">
            <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tags (separadas por vírgula)"
              className="w-full rounded-xl border border-zinc-800/60 bg-zinc-800/30 pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>

          {/* Media toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowMedia(!showMedia)}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-800/60 hover:bg-zinc-800/40 transition-colors"
            >
              <Image size={14} />
              Mídia
            </button>
          </div>

          {/* Media inputs */}
          {showMedia && (
            <div className="space-y-3 rounded-xl border border-zinc-800/40 bg-zinc-800/20 p-4">
              {/* Images */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">
                  Imagens ({imagens.length}/10)
                </label>
                <div className="flex gap-2">
                  <input
                    value={imagemUrl}
                    onChange={(e) => setImagemUrl(e.target.value)}
                    placeholder="URL da imagem"
                    className="flex-1 rounded-lg border border-zinc-800/60 bg-zinc-800/30 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none"
                  />
                  <button
                    onClick={addImage}
                    disabled={!imagemUrl || imagens.length >= 10}
                    className="px-3 py-2 rounded-lg bg-zinc-800 text-xs font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
                {imagens.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagens.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">
                  Vídeo (YouTube URL)
                </label>
                <div className="flex items-center gap-2">
                  <Film size={14} className="text-zinc-600 shrink-0" />
                  <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 rounded-lg border border-zinc-800/60 bg-zinc-800/30 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-zinc-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!conteudo.trim() || loading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Send size={14} />
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
