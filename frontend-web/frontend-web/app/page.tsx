import Link from "next/link";

const features = [
  {
    icon: "🎧",
    title: "Conexão Direta",
    desc: "Conecte-se facilmente com artistas, produtores e locais de eventos — sem intermediários.",
  },
  {
    icon: "📈",
    title: "Visibilidade Real",
    desc: "Seja descoberto por profissionais da indústria musical e expanda sua carreira.",
  },
  {
    icon: "⭐",
    title: "Avaliações Verificadas",
    desc: "Reputação construída por quem realmente trabalhou com você. Confiança real.",
  },
  {
    icon: "🧩",
    title: "Feito pra Música",
    desc: "Propostas, contratos e pagamentos — tudo pensado para o fluxo do mercado musical.",
  },
];

const stats = [
  { value: "500+", label: "Artistas cadastrados" },
  { value: "1.2k", label: "Eventos conectados" },
  { value: "4.8", label: "Avaliação média" },
  { value: "98%", label: "Satisfação" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* ── Background effects ── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-150 w-200 rounded-full bg-linear-to-b from-fuchsia-600/[0.07] via-rose-500/4 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-100 w-125 rounded-full bg-linear-to-t from-amber-500/5 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-0 h-75 w-75 rounded-full bg-linear-to-r from-emerald-500/4 to-transparent blur-3xl" />
      </div>

      {/* ── Navbar ── */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5">
        <Link href="/" className="text-[22px] font-black tracking-tight">
          <span className="bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
            Music Connect
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Home", href: "/" },
            { label: "Explorar", href: "/explore" },
            { label: "Criar Conta", href: "/profile-selector" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:text-white hover:bg-white/4"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-3 inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/60 px-5 py-2 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-200 hover:border-zinc-600 hover:text-white"
          >
            Entrar
          </Link>
        </nav>

        {/* Mobile menu button */}
        <Link
          href="/login"
          className="md:hidden rounded-full border border-zinc-700/60 bg-zinc-900/60 px-4 py-2 text-sm font-semibold text-zinc-300"
        >
          Entrar
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-28 lg:pt-32 lg:pb-36">
        {/* Badge */}
        <div className="fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/60 px-4 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[12px] font-semibold text-zinc-400">
            A plataforma que conecta a música
          </span>
        </div>

        {/* Headline */}
        <h1
          className="fade-in-up max-w-4xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Onde talentos encontram{" "}
          <span className="bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
            palcos
          </span>
        </h1>

        <p
          className="fade-in-up mt-6 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Artistas, bandas, produtores e contratantes em um só lugar. Descubra,
          conecte e faça acontecer.
        </p>

        {/* CTA buttons */}
        <div
          className="fade-in-up mt-10 flex flex-col sm:flex-row items-center gap-4"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explorar Artistas
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href="/profile-selector"
            className="inline-flex items-center gap-2.5 rounded-full border border-zinc-700/60 bg-zinc-900/40 px-7 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-200 hover:border-zinc-600 hover:text-white"
          >
            🚀 Criar Conta Grátis
          </Link>
        </div>

        {/* Trust indicators */}
        <div
          className="fade-in-up mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          style={{ animationDelay: "320ms" }}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-lg font-black text-white tabular-nums">
                {s.value}
              </span>
              <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Visual showcase ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
            {/* Fake app preview */}
            <div className="flex items-center gap-2 border-b border-zinc-800/40 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-zinc-700/60" />
              <span className="h-3 w-3 rounded-full bg-zinc-700/60" />
              <span className="h-3 w-3 rounded-full bg-zinc-700/60" />
              <span className="ml-4 h-5 w-48 rounded-md bg-zinc-800/50" />
            </div>
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1 - Artist */}
                <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/60 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-amber-400/20 to-rose-500/20 text-lg">
                      🎤
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Ana Silva</p>
                      <p className="text-[11px] text-zinc-500">MPB · Jazz</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-zinc-800/60 overflow-hidden">
                      <div className="h-full w-4/5 rounded-full bg-linear-to-r from-amber-400 via-rose-400 to-fuchsia-500" />
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-600">
                      <span>Popularidade</span>
                      <span className="text-amber-400 font-semibold">80%</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Proposal */}
                <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/60 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Pendente
                    </span>
                    <span className="text-xs font-bold text-white">
                      R$ 2.500
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">
                    Festival de Jazz
                  </p>
                  <p className="text-[11px] text-zinc-500 mb-4">
                    São Paulo · 15 mar
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-center text-[11px] font-bold text-white">
                      Aceitar
                    </div>
                    <div className="flex-1 rounded-lg border border-zinc-700 py-1.5 text-center text-[11px] font-bold text-zinc-400">
                      Recusar
                    </div>
                  </div>
                </div>

                {/* Card 3 - Stats */}
                <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/60 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Este mês
                  </p>
                  <p className="text-3xl font-black text-white mb-1">12</p>
                  <p className="text-[11px] text-zinc-500 mb-4">
                    novas conexões
                  </p>
                  <div className="flex items-end gap-1 h-12">
                    {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-linear-to-t from-amber-400/40 to-rose-400/60"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              Por que Music Connect
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Tudo que você precisa para{" "}
              <span className="bg-linear-to-r from-amber-300 to-rose-400 bg-clip-text text-transparent">
                crescer na música
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="fade-in-up group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-6 transition-all duration-300 hover:border-zinc-700/60 hover:bg-zinc-900/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/0 blur-3xl transition-all duration-500 group-hover:bg-amber-500/6" />
                <div className="relative flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60 text-2xl transition-colors group-hover:bg-zinc-800">
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-500">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-linear-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 p-10 md:p-16 text-center">
            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-linear-to-br from-amber-500/10 via-rose-500/[0.07] to-transparent blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-linear-to-tl from-fuchsia-500/10 via-rose-500/[0.07] to-transparent blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl mb-4">
                Pronto para começar?
              </h2>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-500 mb-8">
                Junte-se a centenas de artistas e contratantes que já estão
                transformando a cena musical.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/profile-selector"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Criar Conta Grátis
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/40 px-7 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-200 hover:border-zinc-600 hover:text-white"
                >
                  Já tenho conta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-zinc-800/40 px-6 md:px-12 lg:px-20 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm font-bold bg-linear-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
            Music Connect
          </span>
          <p className="text-[11px] text-zinc-600">
            © {new Date().getFullYear()} Music Connect. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-6">
            {["Termos", "Privacidade", "Contato"].map((item) => (
              <span
                key={item}
                className="text-[11px] text-zinc-600 transition-colors hover:text-zinc-400 cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
