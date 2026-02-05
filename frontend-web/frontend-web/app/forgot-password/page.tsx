"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-bold mb-10 text-center">
          <span className="bg-linear-to-r from-yellow-300 to-pink-500 text-transparent bg-clip-text">
            Recuperar Senha
          </span>
        </h1>

        <p className="text-1xl text-zinc-300 pb-10 text-center max-w-md">
          Digite seu email e enviaremos instruções para redefinir sua senha
        </p>

        <form className="w-full max-w-md space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2 ml-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-full bg-transparent border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-full bg-linear-to-r from-yellow-300 to-pink-500 text-black font-bold hover:opacity-90 transition"
          >
            Enviar Email
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
