"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { StarRating } from "./StarRating";
import { api } from "@/lib/api";

interface ModalAvaliacaoProps {
  isOpen: boolean;
  onClose: () => void;
  idAvaliado: string;
  nomeArtista: string;
  onSuccess: () => void;
}

export function ModalAvaliacao({ isOpen, onClose, idAvaliado, nomeArtista, onSuccess }: ModalAvaliacaoProps) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validação
    if (nota === 0) {
      setError("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Faz o POST /api/avaliacoes
      await api.createAvaliacao({
        id_avaliado: idAvaliado,
        nota,
        comentario,
      });
      
      // Feedback de sucesso
      alert("Avaliação enviada com sucesso! Muito obrigado.");
      setNota(0);
      setComentario("");
      onSuccess();
      onClose();
    } catch (err) {
      setError("Erro ao enviar avaliação. Tente novamente.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="fade-in-up w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro feche a modal
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Avaliar Artista</h2>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-zinc-400 mb-6">
          Como foi sua experiência com <strong className="text-white">{nomeArtista}</strong>? Sua avaliação ajuda outros contratantes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* O teu componente StarRating brilha aqui */}
          <div className="flex flex-col items-center gap-3">
            <StarRating rating={nota} onRatingChange={setNota} size={36} />
            {nota > 0 && <span className="text-xs font-bold text-amber-400">{nota} Estrela{nota > 1 ? 's' : ''}</span>}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-zinc-400">
              Comentário (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Conte como foi o evento..."
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/50"
            />
          </div>

          {error && <p className="text-xs font-medium text-red-400 text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 py-3 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-white py-3 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}