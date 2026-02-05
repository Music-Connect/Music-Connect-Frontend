"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { api, User } from "@/lib/api";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    descricao: "",
    local_evento: "",
    data_evento: "",
    valor: "",
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const fetchUser = async () => {
      try {
        const user = await api.getUserById(parseInt(userId));
        setProfileUser(user);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleSendProposal = async () => {
    if (!currentUser || !profileUser) {
      alert("Você precisa estar logado para enviar propostas");
      return;
    }

    try {
      await api.createProposta({
        id_contratante: currentUser.id_usuario,
        id_artista: profileUser.id_usuario,
        descricao: proposalForm.descricao,
        local_evento: proposalForm.local_evento,
        data_evento: proposalForm.data_evento,
        status: "pendente",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      alert("Proposta enviada com sucesso!");
      setShowModal(false);
      setProposalForm({
        descricao: "",
        local_evento: "",
        data_evento: "",
        valor: "",
      });
    } catch {
      alert("Erro ao enviar proposta");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Usuário não encontrado.
      </div>
    );
  }

  const themeColor = profileUser.cor_tema || "#ec4899";
  const bannerColor = profileUser.cor_banner || "#18181b";
  const isArtistProfile = profileUser.tipo_usuario === "artista";
  const isContractor = currentUser?.tipo_usuario === "contratante";

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-40 bg-black/50 backdrop-blur-md border border-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
      >
        ←
      </button>

      {/* Banner e Header */}
      <div className="relative">
        <div
          className="h-80 w-full relative overflow-hidden"
          style={{
            background: `linear-gradient(to right, #000000, ${bannerColor})`,
          }}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 relative -mt-20 flex flex-col md:flex-row items-end gap-8 pb-8 border-b border-zinc-800">
          <div
            className="w-40 h-40 rounded-full p-1 shadow-2xl relative z-10"
            style={{
              background: `linear-gradient(to top right, #333, ${themeColor})`,
            }}
          >
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-4xl font-bold text-white border-4 border-black overflow-hidden">
              {profileUser.imagem_perfil_url ? (
                <Image
                  src={profileUser.imagem_perfil_url}
                  alt={profileUser.usuario}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                profileUser.usuario.substring(0, 2).toUpperCase()
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black text-white mb-2">
              {profileUser.usuario}
            </h1>
            <p className="text-zinc-400 capitalize mb-4">
              {profileUser.tipo_usuario}
            </p>
            {profileUser.genero_musical && (
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: `${themeColor}20`,
                  color: themeColor,
                }}
              >
                {profileUser.genero_musical}
              </span>
            )}
          </div>

          {isContractor && isArtistProfile && (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 rounded-full font-bold transition"
              style={{ backgroundColor: themeColor, color: "white" }}
            >
              Enviar Proposta
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="font-bold text-white mb-4">Sobre</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {profileUser.descricao || "Nenhuma descrição disponível."}
            </p>
            <div className="space-y-3">
              <InfoItem icon="📧" label="Email" value={profileUser.email} />
              {profileUser.telefone && (
                <InfoItem
                  icon="📱"
                  label="Telefone"
                  value={profileUser.telefone}
                />
              )}
              {profileUser.cidade && (
                <InfoItem
                  icon="📍"
                  label="Localização"
                  value={`${profileUser.cidade}${profileUser.estado ? `, ${profileUser.estado}` : ""}`}
                />
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-bold text-white mb-6 border-b border-zinc-800 pb-2">
            Portfólio / Destaques
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-video bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-600"
              >
                Mídia do Usuário
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Proposta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6">Enviar Proposta</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Local do Evento *
                </label>
                <input
                  type="text"
                  value={proposalForm.local_evento}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      local_evento: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Data do Evento *
                </label>
                <input
                  type="date"
                  value={proposalForm.data_evento}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      data_evento: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  value={proposalForm.valor}
                  onChange={(e) =>
                    setProposalForm({ ...proposalForm, valor: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={proposalForm.descricao}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      descricao: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSendProposal}
                  className="flex-1 px-6 py-2.5 rounded-lg font-bold transition"
                  style={{ backgroundColor: themeColor, color: "white" }}
                >
                  Enviar
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-2">
      <div className="w-8 h-8 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
          {label}
        </p>
        <p className="text-sm text-zinc-300">{value}</p>
      </div>
    </div>
  );
}
