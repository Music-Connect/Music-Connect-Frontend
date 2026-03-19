"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50";

const labelClass = "mb-1.5 block text-[13px] font-medium text-zinc-400";

export default function RegisterContractorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmarSenha: "",
    telefone: "",
    cidade: "",
    estado: "",
    descricao: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const { confirmarSenha: _confirmarSenha, ...rest } = formData;

      const { error } = await authClient.signUp.email({
        email: rest.email,
        password: rest.password,
        name: rest.name,
        // @ts-expect-error additional fields
        tipo_usuario: "contratante",
        telefone: rest.telefone || undefined,
        cidade: rest.cidade || undefined,
        estado: rest.estado || undefined,
        descricao: rest.descricao || undefined,
      });

      if (error) throw new Error(error.message || "Erro ao cadastrar");
      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden py-12">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 right-1/4 h-150 w-150 rounded-full bg-linear-to-bl from-amber-500/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-100 w-100 rounded-full bg-linear-to-tr from-rose-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Header */}
        <div className="fade-in-up mb-8 text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="text-sm font-bold bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
              Music Connect
            </span>
          </Link>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Cadastro de{" "}
            <span className="bg-linear-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
              Contratante
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Encontre artistas perfeitos para seus eventos
          </p>
        </div>

        {/* Form Card */}
        <div
          className="fade-in-up rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-sm"
          style={{ animationDelay: "80ms" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Section: Account */}
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Conta
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Nome ou Empresa *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Nome da empresa"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Senha *
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="confirmarSenha" className={labelClass}>
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    id="confirmarSenha"
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />

            {/* Section: Info */}
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Informações
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="telefone" className={labelClass}>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="hidden sm:block" />
                <div>
                  <label htmlFor="cidade" className={labelClass}>
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    id="cidade"
                    placeholder="São Paulo"
                    value={formData.cidade}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="estado" className={labelClass}>
                    Estado
                  </label>
                  <input
                    type="text"
                    name="estado"
                    id="estado"
                    placeholder="SP"
                    value={formData.estado}
                    onChange={handleChange}
                    maxLength={2}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />

            {/* Description */}
            <div>
              <label htmlFor="descricao" className={labelClass}>
                Sobre sua empresa
              </label>
              <textarea
                name="descricao"
                id="descricao"
                placeholder="Conte sobre sua empresa, eventos que organiza..."
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
                  Cadastrando...
                </>
              ) : (
                <>
                  Criar Conta de Contratante
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          className="fade-in-up mt-8 text-center text-sm text-zinc-500"
          style={{ animationDelay: "160ms" }}
        >
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
