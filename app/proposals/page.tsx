"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ProposalCard from "@/components/ProposalCard";
import { api, Proposta } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { authClient } from "@/lib/auth-client";

export default function ProposalsPage() {
  const router = useRouter();
  const { user, sessionLoaded } = useAuthStore();
  const [proposals, setProposals] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoaded) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const loadProposals = async () => {
      try {
        const [recebidas, enviadas] = await Promise.all([
          api.getPropostasRecebidas(),
          api.getPropostasEnviadas(),
        ]);

        const allProposals = [...recebidas, ...enviadas].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setProposals(allProposals);
      } catch (error: unknown) {
        console.error("Erro ao carregar propostas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, [user, sessionLoaded, router]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleAcceptDecline = async (id: number, status: string) => {
    try {
      await api.updatePropostaStatus(id, status);
      alert(`Proposta ${status}!`);
      setProposals(
        proposals.map((p) =>
          p.id_proposta === id
            ? {
                ...p,
                status: status as
                  | "pendente"
                  | "aceita"
                  | "recusada"
                  | "cancelada",
              }
            : p,
        ),
      );
    } catch {
      alert("Erro ao atualizar status.");
    }
  };

  if (!sessionLoaded || !user) return null;

  const isArtist = user.tipo_usuario === "artista";
  const pageTitle = isArtist ? "Propostas Recebidas" : "Minhas Contratações";

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar
        isArtist={isArtist}
        activePage="proposals"
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative overflow-y-auto scrollbar-hide p-8">
        <h1 className="text-3xl font-bold mb-8 border-b border-zinc-800 pb-4">
          {pageTitle}
        </h1>

        {loading ? (
          <div className="text-zinc-500">Carregando propostas...</div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-zinc-800 border-dashed">
            <p className="text-zinc-400">Você ainda não possui propostas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {proposals.map((item) => (
              <ProposalCard
                key={item.id_proposta}
                item={item}
                isArtist={isArtist}
                onAcceptDecline={handleAcceptDecline}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
