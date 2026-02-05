"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
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

        setFormData({
          usuario: freshUserData.usuario || "",
          email: freshUserData.email || "",
          telefone: freshUserData.telefone || "",
          cidade: freshUserData.cidade || "",
          estado: freshUserData.estado || "",
        });
      } catch (error: unknown) {
        console.error("Erro ao carregar configurações:", error);
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
          setFormData({
            usuario: userData.usuario || "",
            email: userData.email || "",
            telefone: userData.telefone || "",
            cidade: userData.cidade || "",
            estado: userData.estado || "",
          });
        }
      }
    };

    loadUser();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const updatedUser = await api.updateUser(user.id_usuario, formData);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Configurações salvas com sucesso!");
    } catch {
      alert("Erro ao salvar configurações");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-900 p-8 hidden md:block">
        <div
          className="flex items-center gap-2 mb-8 cursor-pointer text-zinc-400 hover:text-white"
          onClick={() => router.push("/dashboard")}
        >
          <span>←</span> Voltar
        </div>

        <h1 className="text-2xl font-bold mb-8">Configurações</h1>

        <nav className="space-y-2">
          <SettingsTab
            label="Conta"
            active={activeTab === "account"}
            onClick={() => setActiveTab("account")}
          />
          <SettingsTab
            label="Segurança"
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          />
          <SettingsTab
            label="Notificações"
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-8 md:p-12 max-w-4xl">
        {/* HEADER MOBILE */}
        <div className="md:hidden mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-zinc-400"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold mt-2">Configurações</h1>
        </div>

        {activeTab === "account" && (
          <div className="space-y-10 animate-fade-in">
            {/* Seção de Perfil */}
            <section>
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-zinc-900">
                Informações Pessoais
              </h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-linear-to-tr from-yellow-300 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-2xl">
                    {user.usuario.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-white">{user.usuario}</p>
                  <p className="text-sm text-zinc-500 capitalize">
                    {user.tipo_usuario}
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                <InputGroup
                  label="Nome de Usuário"
                  value={formData.usuario}
                  onChange={(e) =>
                    setFormData({ ...formData, usuario: e.target.value })
                  }
                />
                <InputGroup label="Email" value={formData.email} disabled />
                <InputGroup
                  label="Telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="Cidade"
                    value={formData.cidade}
                    onChange={(e) =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                  />
                  <InputGroup
                    label="Estado"
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="mt-6 px-6 py-2.5 rounded-full bg-linear-to-r from-yellow-300 to-pink-500 text-black font-bold hover:opacity-90 transition"
              >
                Salvar Alterações
              </button>
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-zinc-900">
                Segurança
              </h2>
              <p className="text-zinc-400 mb-4">
                Gerencie sua senha e configurações de segurança.
              </p>
              <button className="px-6 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition">
                Alterar Senha
              </button>
            </section>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-zinc-900">
                Notificações
              </h2>
              <p className="text-zinc-400">
                Configure como você deseja receber notificações sobre propostas
                e mensagens.
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function SettingsTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
      }`}
    >
      {label}
    </button>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500 transition ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}
