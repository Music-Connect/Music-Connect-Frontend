"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, User } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import BackButton from "@/components/BackButton";
import { BarChart2, User as UserIcon, Lock, Bell, Sun, Moon } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50 disabled:opacity-40 disabled:cursor-not-allowed";
const labelClass = "mb-1.5 block text-[13px] font-medium";

type Tab = "account" | "security" | "notifications";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "account", label: "Conta", icon: <UserIcon size={16} /> },
  { id: "security", label: "Segurança", icon: <Lock size={16} /> },
  { id: "notifications", label: "Notificações", icon: <Bell size={16} /> },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user: storeUser, sessionLoaded } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
  });

  const toggleTheme = () => setIsLightTheme((prev) => !prev);

  useEffect(() => {
    if (!sessionLoaded) return;
    if (!storeUser) {
      router.push("/login");
      return;
    }

    const loadUser = async () => {
      try {
        const freshUserData = await api.getUserById(storeUser.id);
        setUser(freshUserData);
        setFormData({
          name: freshUserData.name || "",
          email: freshUserData.email || "",
          telefone: freshUserData.telefone || "",
          cidade: freshUserData.cidade || "",
          estado: freshUserData.estado || "",
        });
      } catch (error: unknown) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [storeUser, sessionLoaded, router]);

  const handleSave = async () => {
    if (!user || !storeUser) return;
    setSaving(true);
    try {
      const updatedUser = await api.updateUser(storeUser.id, formData);
      setUser(updatedUser);
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

  // ── Tema dinâmico ──
  const theme = {
    page: isLightTheme
      ? "bg-white text-slate-900"
      : "bg-black text-white",
    header: isLightTheme
      ? "border-slate-200 bg-slate-50/80"
      : "border-zinc-800/50 bg-black/70",
    headerBtn: isLightTheme
      ? "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
      : "border-zinc-800/60 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:text-white",
    card: isLightTheme
      ? "border-slate-200 bg-slate-50"
      : "border-zinc-800/50 bg-zinc-900/40",
    input: isLightTheme
      ? "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
      : "border-zinc-800/60 bg-zinc-900/50 text-white placeholder-zinc-600 focus:border-zinc-700 focus:ring-zinc-700/50",
    label: isLightTheme ? "text-slate-600" : "text-zinc-400",
    hint: isLightTheme ? "text-slate-400" : "text-zinc-600",
    navActive: isLightTheme
      ? "bg-slate-200 text-slate-900"
      : "bg-zinc-800/80 text-white",
    navInactive: isLightTheme
      ? "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      : "text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300",
    saveBtn: isLightTheme
      ? "bg-slate-900 text-white hover:bg-slate-700"
      : "bg-white text-black hover:shadow-white/10",
    toggleRow: isLightTheme
      ? "border-slate-200 bg-white"
      : "border-zinc-800/40 bg-zinc-900/30",
    toggleLabel: isLightTheme ? "text-slate-800" : "text-white",
    toggleDesc: isLightTheme ? "text-slate-400" : "text-zinc-600",
    themeBtnClass: isLightTheme
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-white text-black hover:bg-slate-100",
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-300 ${theme.page}`}>
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-120 w-120 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>

      {/* ── Sticky navbar ── */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${theme.header}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <BackButton href="/dashboard" />
            <Link href="/" className="shrink-0">
              <span className="text-xl font-black tracking-tight bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                Music Connect
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${theme.headerBtn}`}
            >
              <BarChart2 size={14} /> Dashboard
            </button>
            <button
              onClick={() => router.push("/profile")}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${theme.headerBtn}`}
            >
              <UserIcon size={14} /> Perfil
            </button>

            {/* ── Botão de tema ── */}
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${theme.themeBtnClass}`}
            >
              {isLightTheme ? <Moon size={14} /> : <Sun size={14} />}
              {isLightTheme ? "Voltar ao tema original" : "Tema branco & azul"}
            </button>

            <div className="relative h-9 w-9 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-0.5 shadow-lg shadow-rose-500/10">
              <div className={`flex h-full w-full items-center justify-center rounded-full text-xs font-bold ${isLightTheme ? "bg-white text-slate-900" : "bg-zinc-900 text-white"}`}>
                {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="fade-in-up mb-8">
          <h1 className="text-3xl font-black tracking-tight">Configurações</h1>
          <p className={`mt-1 text-sm ${theme.hint}`}>
            Gerencie sua conta e preferências
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Tab sidebar ── */}
          <nav className="fade-in-up lg:w-56 shrink-0" style={{ animationDelay: "60ms" }}>
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id ? theme.navActive : theme.navInactive
                  }`}
                >
                  <span className="flex items-center">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* ── Tab content ── */}
          <div className="flex-1 min-w-0">
            {activeTab === "account" && (
              <div className="fade-in-up space-y-8" style={{ animationDelay: "120ms" }}>
                <div className={`rounded-2xl border p-6 backdrop-blur-sm transition-colors duration-300 ${theme.card}`}>
                  <h2 className="mb-6 flex items-center gap-2 text-sm font-bold">
                    Informações Pessoais
                    <span className={`h-px flex-1 ${isLightTheme ? "bg-slate-200" : "bg-zinc-800/60"}`} />
                  </h2>

                  <div className="mb-8 flex items-center gap-5">
                    <div className="relative h-16 w-16 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-0.5 shadow-lg shadow-rose-500/10">
                      <div className={`flex h-full w-full items-center justify-center rounded-full text-lg font-bold ${isLightTheme ? "bg-white text-slate-900" : "bg-zinc-900 text-white"}`}>
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className={`text-xs capitalize ${theme.hint}`}>{user.tipo_usuario}</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className={`${labelClass} ${theme.label}`}>Nome de Usuário</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`${inputClass} ${theme.input}`}
                      />
                    </div>
                    <div>
                      <label className={`${labelClass} ${theme.label}`}>Email</label>
                      <input
                        type="text"
                        value={formData.email}
                        disabled
                        className={`${inputClass} ${theme.input}`}
                      />
                      <p className={`mt-1 text-xs ${theme.hint}`}>O email não pode ser alterado.</p>
                    </div>
                    <div>
                      <label className={`${labelClass} ${theme.label}`}>Telefone</label>
                      <input
                        type="text"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className={`${inputClass} ${theme.input}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`${labelClass} ${theme.label}`}>Cidade</label>
                        <input
                          type="text"
                          value={formData.cidade}
                          onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                          placeholder="São Paulo"
                          className={`${inputClass} ${theme.input}`}
                        />
                      </div>
                      <div>
                        <label className={`${labelClass} ${theme.label}`}>Estado</label>
                        <input
                          type="text"
                          value={formData.estado}
                          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                          placeholder="SP"
                          maxLength={2}
                          className={`${inputClass} ${theme.input}`}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${theme.saveBtn}`}
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
              <div className="fade-in-up space-y-6" style={{ animationDelay: "120ms" }}>
                <div className={`rounded-2xl border p-6 backdrop-blur-sm transition-colors duration-300 ${theme.card}`}>
                  <h2 className="mb-6 flex items-center gap-2 text-sm font-bold">
                    Segurança
                    <span className={`h-px flex-1 ${isLightTheme ? "bg-slate-200" : "bg-zinc-800/60"}`} />
                  </h2>
                  <p className={`text-sm mb-4 ${theme.hint}`}>
                    Gerencie sua senha e configurações de segurança.
                  </p>
                  <button className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${theme.headerBtn}`}>
                    Alterar Senha
                  </button>
                </div>
                <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6 backdrop-blur-sm">
                  <h3 className="mb-2 text-sm font-bold text-red-400">Zona de Perigo</h3>
                  <p className={`text-sm mb-4 ${theme.hint}`}>
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
                <div className={`rounded-2xl border p-6 backdrop-blur-sm transition-colors duration-300 ${theme.card}`}>
                  <h2 className="mb-6 flex items-center gap-2 text-sm font-bold">
                    Notificações
                    <span className={`h-px flex-1 ${isLightTheme ? "bg-slate-200" : "bg-zinc-800/60"}`} />
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: "Novas propostas", desc: "Receba alertas quando uma nova proposta for enviada", defaultOn: true },
                      { label: "Mensagens", desc: "Notificações sobre novas mensagens recebidas", defaultOn: true },
                      { label: "Atualizações do sistema", desc: "Novidades e atualizações da plataforma", defaultOn: false },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between rounded-xl border px-4 py-4 transition-colors duration-300 ${theme.toggleRow}`}
                      >
                        <div>
                          <p className={`text-sm font-semibold ${theme.toggleLabel}`}>{item.label}</p>
                          <p className={`mt-0.5 text-xs ${theme.toggleDesc}`}>{item.desc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" defaultChecked={item.defaultOn} className="peer sr-only" />
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