"use client";

import Image from "next/image";
import { Proposta } from "@/lib/api";

interface ProposalCardProps {
  item: Proposta;
  isArtist: boolean;
  onAcceptDecline?: (id: number, status: string) => void;
}

const statusConfig: Record<string, { bg: string; dot: string; label: string }> =
  {
    pendente: {
      bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dot: "bg-amber-400",
      label: "Pendente",
    },
    aceita: {
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-400",
      label: "Aceita",
    },
    recusada: {
      bg: "bg-red-500/10 text-red-400 border-red-500/20",
      dot: "bg-red-400",
      label: "Recusada",
    },
    cancelada: {
      bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      dot: "bg-zinc-500",
      label: "Cancelada",
    },
  };

export default function ProposalCard({
  item,
  isArtist,
  onAcceptDecline,
}: ProposalCardProps) {
  const status = statusConfig[item.status] || statusConfig.pendente;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-zinc-700/80 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5">
      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-linear-to-br from-amber-500/0 to-rose-500/0 blur-2xl transition-all duration-500 group-hover:from-amber-500/10 group-hover:to-rose-500/10" />

      <div className="relative">
        {/* Status + Avatar Row */}
        <div className="flex items-start justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${status.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-lg overflow-hidden ring-2 ring-zinc-800 transition-all duration-300 group-hover:ring-zinc-700">
            {item.imagem_perfil_url ? (
              <Image
                src={item.imagem_perfil_url}
                alt="Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : isArtist ? (
              "🏢"
            ) : (
              "🎵"
            )}
          </div>
        </div>

        {/* Event Title */}
        <h3
          className="font-bold text-white text-base mb-1 truncate group-hover:text-amber-50 transition-colors"
          title={item.local_evento}
        >
          {item.local_evento}
        </h3>
        <p className="text-xs text-zinc-500 mb-4 truncate">
          {isArtist ? "De: " : "Para: "}
          <span className="text-zinc-400">{item.nome_outro}</span>
        </p>

        {/* Details */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <span className="text-xs">📅</span> Data
            </span>
            <span className="text-white font-medium text-xs">
              {formatDate(item.data_evento)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <span className="text-xs">💰</span> Valor
            </span>
            <span className="text-white font-semibold text-sm">
              {formatCurrency(item.valor_oferecido)}
            </span>
          </div>
        </div>

        {item.descricao && (
          <p className="text-[11px] text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
            {item.descricao}
          </p>
        )}

        {/* Action buttons */}
        {isArtist && item.status === "pendente" && onAcceptDecline && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onAcceptDecline(item.id_proposta, "aceita")}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.97]"
            >
              Aceitar
            </button>
            <button
              onClick={() => onAcceptDecline(item.id_proposta, "recusada")}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-xs font-bold text-zinc-300 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 active:scale-[0.97]"
            >
              Recusar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
