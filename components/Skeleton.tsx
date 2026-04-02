// components/Skeleton.tsx
// Componente base reutilizável para skeleton loaders.

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-800/60 ${className}`} />;
}

// ── Skeleton de perfil completo ──────────────────────────────────────────────
export function ProfileSkeleton() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-120 w-120 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-5 w-32 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="hidden sm:block h-8 w-28 rounded-xl" />
            <Skeleton className="hidden sm:block h-8 w-32 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="h-56 sm:h-64 w-full bg-zinc-900/60 animate-pulse" />

      {/* Profile header */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="-mt-20 flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8 border-b border-zinc-800/50">
          <Skeleton className="h-36 w-36 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col items-center sm:items-start gap-3">
            <Skeleton className="h-9 w-56 rounded-xl" />
            <Skeleton className="h-4 w-20 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-6 w-28 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded-xl shrink-0" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna esquerda */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
              <Skeleton className="h-4 w-16 rounded mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 rounded" />
                <Skeleton className="h-3 w-4/6 rounded" />
              </div>
              <div className="mt-6 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-2.5 w-12 rounded" />
                      <Skeleton className="h-3.5 w-36 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
              <Skeleton className="h-4 w-12 rounded mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            </div>
          </div>

          {/* Coluna direita */}
          <div className="lg:col-span-2">
            <div className="flex gap-1 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-1 w-fit mb-8">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 mb-6">
              <Skeleton className="h-3 w-full rounded mb-2" />
              <Skeleton className="h-3 w-4/5 rounded" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4"
                >
                  <Skeleton className="h-5 w-5 rounded-lg mb-2" />
                  <Skeleton className="h-2.5 w-14 rounded mb-1" />
                  <Skeleton className="h-4 w-10 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton de settings completo ────────────────────────────────────────────
export function SettingsSkeleton() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-linear-to-bl from-fuchsia-600/6 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-120 w-120 rounded-full bg-linear-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-5 w-32 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="hidden sm:block h-8 w-28 rounded-xl" />
            <Skeleton className="hidden sm:block h-8 w-24 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-40 rounded-xl mb-2" />
          <Skeleton className="h-4 w-56 rounded-lg" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <div className="lg:w-56 shrink-0">
            <div className="flex lg:flex-col gap-1">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1">
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
              <Skeleton className="h-4 w-40 rounded mb-6" />

              {/* Avatar row */}
              <div className="flex items-center gap-5 mb-8">
                <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-3.5 w-20 rounded" />
                </div>
              </div>

              {/* Campos */}
              <div className="space-y-5">
                {(["w-28", "w-16", "w-20", "w-24"] as const).map((w, i) => (
                  <div key={i}>
                    <Skeleton className={`h-3 ${w} rounded mb-1.5`} />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-3 w-12 rounded mb-1.5" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-14 rounded mb-1.5" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                </div>

                <Skeleton className="h-11 w-36 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
