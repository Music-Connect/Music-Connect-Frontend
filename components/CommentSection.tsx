"use client";

import { useState, useEffect } from "react";
import { X, Send, CornerDownRight } from "lucide-react";
import { Post, Comentario, api } from "@/lib/api";

interface CommentSectionProps {
  post: Post;
  onClose: () => void;
}

export default function CommentSection({ post, onClose }: CommentSectionProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const load = async (reset = false) => {
    setLoading(true);
    try {
      const result = await api.getComentarios(post.id, reset ? undefined : cursor ?? undefined);
      setComentarios(reset ? result.data : [...comentarios, ...result.data]);
      setCursor(result.meta.nextCursor);
      setHasMore(result.meta.hasMore);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load(true);
  }, [post.id]);

  const handleSubmit = async () => {
    if (!texto.trim() || sending) return;
    setSending(true);
    try {
      const novo = await api.createComentario(post.id, {
        conteudo: texto.trim(),
        id_comentario_pai: replyTo?.id,
      });
      if (replyTo) {
        setComentarios((prev) =>
          prev.map((c) =>
            c.id === replyTo.id ? { ...c, respostas: [...(c.respostas || []), novo] } : c
          )
        );
      } else {
        setComentarios((prev) => [novo, ...prev]);
      }
      setTexto("");
      setReplyTo(null);
    } catch {}
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-zinc-800/60 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/50 shrink-0">
          <h3 className="text-sm font-bold text-white">Comentários</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading && comentarios.length === 0 && (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {!loading && comentarios.length === 0 && (
            <p className="text-center text-sm text-zinc-600 py-8">Nenhum comentário ainda. Seja o primeiro!</p>
          )}

          {comentarios.map((c) => (
            <div key={c.id} className="space-y-2">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-fuchsia-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0 overflow-hidden">
                  {c.autor.image ? (
                    <img src={c.autor.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    c.autor.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{c.autor.name}</span>
                    <span className="text-[10px] text-zinc-600">
                      {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-0.5">{c.conteudo}</p>
                  <button
                    onClick={() => setReplyTo({ id: c.id, name: c.autor.name })}
                    className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300 mt-1 transition-colors"
                  >
                    Responder
                  </button>
                </div>
              </div>

              {/* Replies */}
              {c.respostas && c.respostas.length > 0 && (
                <div className="ml-11 space-y-2 border-l border-zinc-800/40 pl-3">
                  {c.respostas.map((r) => (
                    <div key={r.id} className="flex gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center text-white text-[9px] font-bold shrink-0 overflow-hidden">
                        {r.autor.image ? (
                          <img src={r.autor.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          r.autor.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-white">{r.autor.name}</span>
                          <span className="text-[10px] text-zinc-600">
                            {new Date(r.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-0.5">{r.conteudo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {hasMore && (
            <button
              onClick={() => load()}
              className="w-full text-center text-xs font-medium text-zinc-500 hover:text-zinc-300 py-2 transition-colors"
            >
              Carregar mais
            </button>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800/50 px-4 py-3 shrink-0">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-[11px] text-zinc-500">
              <CornerDownRight size={12} />
              Respondendo a <span className="font-semibold text-zinc-300">{replyTo.name}</span>
              <button onClick={() => setReplyTo(null)} className="ml-auto text-zinc-600 hover:text-zinc-400">
                <X size={12} />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Escreva um comentário..."
              className="flex-1 rounded-xl border border-zinc-800/60 bg-zinc-800/30 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
            <button
              onClick={handleSubmit}
              disabled={!texto.trim() || sending}
              className="p-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
