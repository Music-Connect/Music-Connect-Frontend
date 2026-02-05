import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-black to-purple-950 text-white font-sans">
      {/* Header */}
      <header className="flex justify-between items-center py-6 px-8 md:px-16">
        <div className="text-4xl font-black text-yellow-300">
          Music
          <span className="bg-linear-to-r from-yellow-300 to-pink-500 bg-clip-text text-transparent">
            Connect
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/profile-selector"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            Criar
          </Link>
          <Link
            href="/login"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            Entrar
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center py-16 px-12 md:px-20">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="bg-linear-to-r from-yellow-300 to-pink-400 text-transparent bg-clip-text">
                Conecte talentos.
              </span>
            </h1>
            <p className="text-lg text-gray-300 my-8 max-w-md mx-auto md:mx-0">
              Uma plataforma para artistas, bandas, produtores e contratantes se
              encontrarem através da música.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <Link
                href="/explore"
                className="border border-gray-600 rounded-full px-6 py-3 flex items-center gap-2 text-white hover:border-white transition-colors"
              >
                <span role="img" aria-label="Lupa">
                  🔍
                </span>
                <span>Descobrir Talentos</span>
              </Link>
              <Link
                href="/profile-selector"
                className="border border-gray-600 rounded-full px-6 py-3 flex items-center gap-2 text-white hover:border-white transition-colors"
              >
                <span role="img" aria-label="Foguete">
                  🚀
                </span>
                <span>Criar</span>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="w-full h-auto max-w-lg mx-auto bg-linear-to-br from-purple-600/20 to-pink-600/20 rounded-3xl aspect-square flex items-center justify-center text-6xl">
              🎵
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-24 px-8 md:px-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-16 max-w-2xl">
            Navegue pelo universo da música com o Music Connect: sua rede de
            oportunidades.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-3 border-purple-900 rounded-lg p-6 flex flex-col gap-3 bg-black">
              <span className="text-5xl">🎧</span>
              <h3 className="text-xl font-bold text-white">Conexão direta</h3>
              <p className="text-sm text-gray-400">
                Conecte-se facilmente com outros artistas, produtores e locais.
              </p>
            </div>

            <div className="border-3 border-purple-900 rounded-lg p-6 flex flex-col gap-3 bg-black">
              <span className="text-5xl">↗️</span>
              <h3 className="text-xl font-bold text-white">
                Aumenta sua visibilidade
              </h3>
              <p className="text-sm text-gray-400">
                Seja notado por profissionais da indústria musical e expanda sua
                carreira.
              </p>
            </div>

            <div className="border-3 border-purple-900 rounded-lg p-6 flex flex-col gap-3 bg-black">
              <span className="text-5xl">⭐</span>
              <h3 className="text-xl font-bold text-white">4.8+ Avaliações</h3>
              <p className="text-sm text-gray-400">
                Avaliado positivamente por críticos.
              </p>
            </div>

            <div className="border-3 border-purple-900 rounded-lg p-6 flex flex-col gap-3 bg-black">
              <span className="text-5xl">🧩</span>
              <h3 className="text-xl font-bold text-white">
                Funcional e Adaptável
              </h3>
              <p className="text-sm text-gray-400">
                Uma plataforma criada para atender às suas necessidades únicas.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
