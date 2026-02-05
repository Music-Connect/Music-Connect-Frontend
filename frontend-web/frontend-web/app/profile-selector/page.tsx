"use client";

import Link from "next/link";

export default function ProfileSelectorPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <span className="text-6xl font-bold mb-2 text-center">
          <h1 className="text-5xl font-bold mb-10 text-center">
            <span className="bg-linear-to-r from-yellow-300 to-pink-500 text-transparent bg-clip-text">
              Escolha seu perfil
            </span>
          </h1>
        </span>

        <p className="text-lg text-zinc-400 pt-10">
          Você quer se cadastrar como artista ou como contratante?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full max-w-4xl">
          {/* Artista */}
          <Link href="/register-artist">
            <div className="bg-black border-2 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ease-in-out border-pink-400 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-2">
              <span className="text-6xl mb-6">🎤</span>
              <h4 className="text-2xl font-bold mb-2 text-pink-400">
                Sou Artista
              </h4>
              <p className="text-zinc-400">
                Divulgue seu talento e receba convites para eventos
              </p>
            </div>
          </Link>

          {/* Contratante */}
          <Link href="/register-contractor">
            <div className="bg-black border-2 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ease-in-out border-yellow-400 hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-2">
              <span className="text-6xl mb-6">🎧</span>
              <h4 className="text-2xl font-bold mb-2 text-yellow-400">
                Sou Contratante
              </h4>
              <p className="text-zinc-400">
                Encontre e contrate artistas para seus eventos
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-zinc-400">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-pink-500 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
