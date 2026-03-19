"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, User } from "@/lib/api";

const inputClass =
  "w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50 disabled:opacity-40 disabled:cursor-not-allowed";
const labelClass = "mb-1.5 block text-[13px] font-medium text-zinc-400";

type Tab = "account" | "security" | "notifications";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "account", label: "Conta", icon: "👤" },
  { id: "security", label: "Segurança", icon: "🔒" },
  { id: "notifications", label: "Notificações", icon: "🔔" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("account");
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
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/login");
          return;
        }
        const userData = JSON.parse(storedUser);
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
        if (error instanceof Error && error.message.includes("401")) {
          localStorage.removeItem("user");
          localStorage.removeItem("type");
          router.push("/login");
          return;
        }
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
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updatedUser = await api.updateUser(user.id_usuario, formData);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch {
      alert("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-120 w-120 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>

      {/* ── Sticky navbar ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="shrink-0">
            <span className="text-xl font-black tracking-tight bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
              Music Connect
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
            >
              👤 Perfil
            </button>
            <div className="relative h-9 w-9 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-0.5 shadow-lg shadow-rose-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                {user.usuario
                  ? user.usuario.substring(0, 2).toUpperCase()
                  : "U"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* Page heading */}
        <div className="fade-in-up mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Configurações
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie sua conta e preferências
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Tab sidebar ── */}
          <nav
            className="fade-in-up lg:w-56 shrink-0"
            style={{ animationDelay: "60ms" }}
          >
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-zinc-800/80 text-white shadow-sm"
                      : "text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* ── Tab content ── */}
          <div className="flex-1 min-w-0">
            {activeTab === "account" && (
              <div
                className="fade-in-up space-y-8"
                style={{ animationDelay: "120ms" }}
              >
                {/* Profile summary */}
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm">
                  <h2 className="mb-6 flex items-center gap-2 text-sm font-bold text-white">
                    Informações Pessoais
                    <span className="h-px flex-1 bg-zinc-800/60" />
                  </h2>

                  {/* Avatar row */}
                  <div className="mb-8 flex items-center gap-5">
                    <div className="relative h-16 w-16 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-0.5 shadow-lg shadow-rose-500/10">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white">
                        {user.usuario.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-white">{user.usuario}</p>
                      <p className="text-xs text-zinc-500 capitalize">
                        {user.tipo_usuario}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className={labelClass}>Nome de Usuário</label>
                      <input
                        type="text"
                        value={formData.usuario}
                        onChange={(e) =>
                          setFormData({ ...formData, usuario: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        type="text"
                        value={formData.email}
                        disabled
                        className={inputClass}
                      />
                      <p className="mt-1 text-xs text-zinc-600">
                        O email não pode ser alterado.
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>Telefone</label>
                      <input
                        type="text"
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData({ ...formData, telefone: e.target.value })
                        }
                        placeholder="(11) 99999-9999"
                        className={inputClass}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Cidade</label>
                        <input
                          type="text"
                          value={formData.cidade}
                          onChange={(e) =>
                            setFormData({ ...formData, cidade: e.target.value })
                          }
                          placeholder="São Paulo"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Estado</label>
                        <input
                          type="text"
                          value={formData.estado}
                          onChange={(e) =>
                            setFormData({ ...formData, estado: e.target.value })
                          }
                          placeholder="SP"
                          maxLength={2}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {saving ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Alterações"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div
                className="fade-in-up space-y-6"
                style={{ animationDelay: "120ms" }}
              >
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm">
                  <h2 className="mb-6 flex items-center gap-2 text-sm font-bold text-white">
                    Segurança
                    <span className="h-px flex-1 bg-zinc-800/60" />
                  </h2>
                  <p className="text-sm text-zinc-500 mb-4">
                    Gerencie sua senha e configurações de segurança.
                  </p>
                  <button className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white">
                    Alterar Senha
                  </button>
                </div>

                <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6 backdrop-blur-sm">
                  <h3 className="mb-2 text-sm font-bold text-red-400">
                    Zona de Perigo
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4">
                    A exclusão da conta é permanente e não pode ser desfeita.
                  </p>
                  <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20">
                    Excluir Conta
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="fade-in-up" style={{ animationDelay: "120ms" }}>
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 backdrop-blur-sm">
                  <h2 className="mb-6 flex items-center gap-2 text-sm font-bold text-white">
                    Notificações
                    <span className="h-px flex-1 bg-zinc-800/60" />
                  </h2>
                  <div className="space-y-5">
                    {[
                      {
                        label: "Novas propostas",
                        desc: "Receba alertas quando uma nova proposta for enviada",
                        defaultOn: true,
                      },
                      {
                        label: "Mensagens",
                        desc: "Notificações sobre novas mensagens recebidas",
                        defaultOn: true,
                      },
                      {
                        label: "Atualizações do sistema",
                        desc: "Novidades e atualizações da plataforma",
                        defaultOn: false,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-zinc-800/40 bg-zinc-900/30 px-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-600">
                            {item.desc}
                          </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            defaultChecked={item.defaultOn}
                            className="peer sr-only"
                          />
                          <div className="h-6 w-11 rounded-full bg-zinc-800 transition-colors peer-checked:bg-emerald-500/80 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
