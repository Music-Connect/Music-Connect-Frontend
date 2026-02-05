"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterContractorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    senha: "",
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

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmarSenha: _confirmarSenha, ...data } = {
        ...formData,
        tipo_usuario: "contratante" as const,
      };

      await api.register(data);

      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black py-12">
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-bold mb-10 text-center">
          <span className="bg-linear-to-r from-yellow-300 to-pink-500 text-transparent bg-clip-text">
            Cadastro de Contratante
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="usuario"
                className="block text-sm font-medium text-gray-300 mb-2 ml-2"
              >
                Nome ou Empresa *
              </label>
              <input
                type="text"
                name="usuario"
                id="usuario"
                placeholder="Nome da empresa ou seu nome"
                value={formData.usuario}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2 ml-2"
              >
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
                className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-gray-300 mb-2 ml-2"
              >
                Senha *
              </label>
              <input
                type="password"
                name="senha"
                id="senha"
                placeholder="Mínimo 6 caracteres"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="confirmarSenha"
                className="block text-sm font-medium text-gray-300 mb-2 ml-2"
              >
                Confirmar Senha *
              </label>
              <input
                type="password"
                name="confirmarSenha"
                id="confirmarSenha"
                placeholder="Digite a senha novamente"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-300 mb-2 ml-2"
              >
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                id="telefone"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="cidade"
                className="block text-sm font-medium text-gray-300 mb-2 ml-2"
              >
                Cidade
              </label>
              <input
                type="text"
                name="cidade"
                id="cidade"
                placeholder="Sua cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="estado"
                className="block text-sm font-medium text-gray-300 mb-2 ml-2"
              >
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
                className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-300 mb-2 ml-2"
            >
              Descrição
            </label>
            <textarea
              name="descricao"
              id="descricao"
              placeholder="Conte um pouco sobre sua empresa ou eventos..."
              value={formData.descricao}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-full bg-linear-to-r from-yellow-300 to-pink-500 text-black font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <div className="text-center">
            <p className="text-zinc-400">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-pink-500 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
