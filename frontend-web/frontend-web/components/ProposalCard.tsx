"use client";

import { Proposta } from "@/lib/api";

interface ProposalCardProps {
  item: Proposta;
  isArtist: boolean;
  onAcceptDecline?: (id: number, status: string) => void;
}

export default function ProposalCard({
  item,
  isArtist,
  onAcceptDecline,
}: ProposalCardProps) {
  const statusColors: Record<string, string> = {
    pendente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    aceita: "bg-green-500/10 text-green-500 border-green-500/20",
    recusada: "bg-red-500/10 text-red-500 border-red-500/20",
    cancelada: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all group">
      <div
        className={`inline-block px-2 py-1 rounded-lg text-xs font-bold border mb-4 ${
          statusColors[item.status] || statusColors.pendente
        }`}
      >
        {item.status}
      </div>

      <div>
        <div className="mb-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 mb-3 flex items-center justify-center text-xl overflow-hidden">
            {item.imagem_perfil_url ? (
              <img
                src={item.imagem_perfil_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : isArtist ? (
              "🏢"
            ) : (
              "🎵"
            )}
          </div>

          <h3
            className="font-bold text-white text-lg mb-1 truncate"
            title={item.local_evento}
          >
            {item.local_evento}
          </h3>

          <p className="text-sm text-zinc-400 flex items-center gap-1 truncate">
            {isArtist ? "De: " : "Para: "} {item.nome_outro}
          </p>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-zinc-500">📅 Data:</span>
            <span className="text-white font-medium">
              {formatDate(item.data_evento)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">💰 Valor:</span>
            <span className="text-white font-medium">
              {formatCurrency(item.valor_oferecido)}
            </span>
          </div>
        </div>

        {item.descricao && (
          <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
            {item.descricao}
          </p>
        )}

        {isArtist && item.status === "pendente" && onAcceptDecline && (
          <div className="flex gap-2">
            <button
              onClick={() => onAcceptDecline(item.id_proposta, "aceita")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Aceitar
            </button>
            <button
              onClick={() => onAcceptDecline(item.id_proposta, "recusada")}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-lg transition"
            >
              Recusar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
