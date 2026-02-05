"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardBanner from "@/components/DashboardBanner";
import ProposalCard from "@/components/ProposalCard";
import { api, User, Proposta } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Verify user data in localStorage
        const storedUser = localStorage.getItem("user");
        const storedType = localStorage.getItem("type");

        if (!storedUser || !storedType) {
          router.push("/login");
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Load proposals based on user type
        let proposalsData: Proposta[] = [];
        if (storedType === "artista") {
          proposalsData = await api.getPropostasRecebidas(userData.id_usuario);
        } else {
          proposalsData = await api.getPropostasEnviadas(userData.id_usuario);
        }

        setProposals(proposalsData);
      } catch (error: unknown) {
        console.error("Erro ao carregar dados:", error);
        // If cookie is invalid or expired, redirect to login
        if (error instanceof Error && error.message.includes("401")) {
          localStorage.removeItem("user");
          localStorage.removeItem("type");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("type");
      router.push("/login");
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/explore?search=${searchTerm}`);
    }
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

  if (!user) return null;

  const userType = localStorage.getItem("type") || "";
  const isArtist = userType === "artista";
  const sectionTitle = isArtist ? "Propostas Recebidas" : "Propostas Enviadas";

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar
        isArtist={isArtist}
        activePage="dashboard"
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative overflow-y-auto scrollbar-hide">
        <Header
          user={user}
          userType={userType}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
        />

        <div className="p-8">
          <DashboardBanner isArtist={isArtist} />

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                {sectionTitle}
                <span className="text-xs font-normal bg-pink-500/10 text-pink-500 px-2 py-1 rounded-full border border-pink-500/20">
                  {proposals.length} Total
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="text-zinc-500">Carregando...</div>
            ) : proposals.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-zinc-800 border-dashed">
                <p className="text-zinc-400 mb-4">
                  Nenhuma proposta encontrada.
                </p>
                {isArtist ? (
                  <p className="text-sm text-zinc-500">
                    Mantenha seu perfil atualizado para receber ofertas.
                  </p>
                ) : (
                  <button
                    onClick={() => router.push("/explore")}
                    className="text-yellow-300 hover:underline"
                  >
                    Explorar Artistas e Enviar Propostas
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
          </div>
        </div>
      </main>
    </div>
  );
}
