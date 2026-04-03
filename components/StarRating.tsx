"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // Nota atual (controlada pelo componente pai)
  onRatingChange?: (rating: number) => void; // Função para alterar a nota
  readOnly?: boolean; // Se true, desativa cliques e hover
  size?: number; // Tamanho do ícone em pixels
  maxStars?: number; // Quantidade máxima de estrelas (padrão 5)
}

export function StarRating({
  rating,
  onRatingChange,
  readOnly = false,
  size = 24,
  maxStars = 5,
}: StarRatingProps) {
  // Estado para controlar a nota quando o rato passa por cima
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Cria um array de 1 até maxStars (ex: [1, 2, 3, 4, 5])
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <div
      className="flex items-center gap-1"
      role={readOnly ? "img" : "group"}
      aria-label={readOnly ? `Avaliação: ${rating} de ${maxStars} estrelas` : "Avalie de 1 a 5 estrelas"}
    >
      {stars.map((star) => {
        // A estrela deve ser preenchida se o rating atual ou o rating em hover for maior ou igual a ela
        const isFilled = (hoverRating || rating) >= star;
        const colorClass = isFilled
          ? "text-yellow-400 fill-yellow-400"
          : "text-zinc-600 fill-transparent";

        // Modo de Apenas Leitura (Sem botão, sem hover)
        if (readOnly) {
          return (
            <Star
              key={star}
              size={size}
              className={`${colorClass} transition-colors duration-200`}
            />
          );
        }

        // Modo Interativo (Com botões acessíveis e hover)
        return (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange?.(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Avaliar com ${star} estrela${star > 1 ? "s" : ""}`}
            className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-sm"
          >
            <Star
              size={size}
              className={`${colorClass} transition-colors duration-200 cursor-pointer`}
            />
          </button>
        );
      })}
    </div>
  );
}