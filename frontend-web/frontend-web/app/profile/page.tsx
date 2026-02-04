"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "@/lib/api";

const DEFAULT_THEME = "#ec4899";
const DEFAULT_BANNER = "#18181b";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("sobre");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    descricao: "",
    telefone: "",
    cidade: "",
    estado: "",
    genero_musical: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Verify user data in localStorage
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          router.push("/login");
          return;
        }

        const userData = JSON.parse(storedUser);

        // Fetch fresh user data from API
        const freshUserData = await api.getUserById(userData.id_usuario);
        setUser(freshUserData);

        setEditForm({
          descricao: freshUserData.descricao || "",
          telefone: freshUserData.telefone || "",
          cidade: freshUserData.cidade || "",
          estado: freshUserData.estado || "",
          genero_musical: freshUserData.genero_musical || "",
        });
      } catch (error: unknown) {
        console.error("Erro ao carregar perfil:", error);
        // If cookie is invalid or expired, redirect to login
        if (error instanceof Error && error.message.includes("401")) {
          localStorage.removeItem("user");
          localStorage.removeItem("type");
          router.push("/login");
          return;
        }
        // Use stored data as fallback
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setEditForm({
            descricao: userData.descricao || "",
            telefone: userData.telefone || "",
            cidade: userData.cidade || "",
            estado: userData.estado || "",
            genero_musical: userData.genero_musical || "",
          });
        }
      }
    };

    loadUser();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const updatedUser = await api.updateUser(user.id_usuario, editForm);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar perfil");
    }
  };

  if (!user) return null;

  const themeColor = user.cor_tema || DEFAULT_THEME;
  const bannerColor = user.cor_banner || DEFAULT_BANNER;

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Botão Voltar */}
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed top-6 left-6 z-40 bg-black/50 backdrop-blur-md border border-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
      >
        ←
      </button>

      {/* Banner */}
      <div className="relative">
        <div
          className="h-80 w-full relative overflow-hidden"
          style={{
            background: `linear-gradient(to right, #000000, ${bannerColor})`,
          }}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        {/* Info Container */}
        <div className="max-w-6xl mx-auto px-6 md:px-10 relative -mt-20 flex flex-col md:flex-row items-end gap-8 pb-8 border-b border-zinc-800">
          {/* Foto de Perfil */}
          <div
            className="w-40 h-40 rounded-full p-1 shadow-2xl relative z-10"
            style={{
              background: `linear-gradient(to top right, #333, ${themeColor})`,
            }}
          >
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-4xl font-bold text-white border-4 border-black overflow-hidden">
              {user.imagem_perfil_url ? (
                <img
                  src={user.imagem_perfil_url}
                  alt={user.usuario}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.usuario.substring(0, 2).toUpperCase()
              )}
            </div>
          </div>

          {/* Informações */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black text-white mb-2">
              {user.usuario}
            </h1>
            <p className="text-zinc-400 capitalize mb-4">{user.tipo_usuario}</p>
            {user.genero_musical && (
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: `${themeColor}20`,
                  color: themeColor,
                }}
              >
                {user.genero_musical}
              </span>
            )}
          </div>

          {/* Botão Editar */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2.5 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition"
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              Sobre
              <span className="h-px flex-1 bg-zinc-800"></span>
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editForm.descricao}
                  onChange={(e) =>
                    setEditForm({ ...editForm, descricao: e.target.value })
                  }
                  placeholder="Adicione uma descrição..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm resize-none"
                  rows={4}
                />
                <input
                  type="text"
                  value={editForm.telefone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, telefone: e.target.value })
                  }
                  placeholder="Telefone"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm"
                />
                <input
                  type="text"
                  value={editForm.cidade}
                  onChange={(e) =>
                    setEditForm({ ...editForm, cidade: e.target.value })
                  }
                  placeholder="Cidade"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm"
                />
                <input
                  type="text"
                  value={editForm.estado}
                  onChange={(e) =>
                    setEditForm({ ...editForm, estado: e.target.value })
                  }
                  placeholder="Estado (SP)"
                  maxLength={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm"
                />
                {user.tipo_usuario === "artista" && (
                  <select
                    value={editForm.genero_musical}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        genero_musical: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm"
                  >
                    <option value="">Selecione o gênero</option>
                    <option value="Rock">Rock</option>
                    <option value="Pop">Pop</option>
                    <option value="Sertanejo">Sertanejo</option>
                    <option value="Eletrônica">Eletrônica</option>
                    <option value="MPB">MPB</option>
                    <option value="Jazz">Jazz</option>
                  </select>
                )}
                <button
                  onClick={handleSave}
                  className="w-full px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition"
                >
                  Salvar Alterações
                </button>
              </div>
            ) : (
              <>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 whitespace-pre-line">
                  {user.descricao ||
                    "Olá! Adicione uma descrição ao seu perfil."}
                </p>
                <div className="space-y-3">
                  <InfoItem icon="📧" label="Email" value={user.email} />
                  {user.telefone && (
                    <InfoItem
                      icon="📱"
                      label="Telefone"
                      value={user.telefone}
                    />
                  )}
                  {user.cidade && (
                    <InfoItem
                      icon="📍"
                      label="Localização"
                      value={`${user.cidade}${user.estado ? `, ${user.estado}` : ""}`}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-zinc-800 mb-8">
            <TabButton
              active={activeTab === "sobre"}
              onClick={() => setActiveTab("sobre")}
              color={themeColor}
            >
              Sobre
            </TabButton>
            <TabButton
              active={activeTab === "portfolio"}
              onClick={() => setActiveTab("portfolio")}
              color={themeColor}
            >
              Portfólio
            </TabButton>
          </div>

          {/* Conteúdo das Tabs */}
          {activeTab === "sobre" && (
            <div className="text-zinc-400">
              <p>
                Esta é a página de perfil de{" "}
                <strong className="text-white">{user.usuario}</strong>. Adicione
                mais informações sobre você editando o perfil.
              </p>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="text-zinc-400">
              <p className="mb-4">Adicione seus trabalhos e projetos aqui.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center"
                  >
                    <span className="text-zinc-600">+</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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
    <div className="flex items-start gap-3 p-2 hover:bg-zinc-800/50 rounded-lg transition overflow-hidden">
      <div className="w-8 h-8 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
          {label}
        </p>
        <p className="text-sm text-zinc-300 truncate">{value}</p>
      </div>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
  color,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 text-sm font-bold border-b-2 transition-all ${
        active
          ? "text-white"
          : "border-transparent text-zinc-500 hover:text-zinc-300"
      }`}
      style={{ borderColor: active ? color : "transparent" }}
    >
      {children}
    </button>
  );
}
