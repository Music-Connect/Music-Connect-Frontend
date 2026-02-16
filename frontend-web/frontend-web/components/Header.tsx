"use client";

interface HeaderProps {
  user: {
    usuario: string;
  };
  userType: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
}

export default function Header({
  user,
  userType,
  searchTerm,
  onSearchChange,
  onSearch,
}: HeaderProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <header className="flex items-center justify-between gap-6 px-6 lg:px-8 py-4 border-b border-zinc-800/50 bg-black/60 backdrop-blur-xl sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <div className="group relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm transition-colors group-focus-within:text-zinc-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar artistas, gêneros..."
            value={searchTerm || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700/50"
          />
        </div>
      </div>

      {/* User Area */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-900/40 text-sm text-zinc-400 transition-all hover:border-zinc-700 hover:text-white">
          🔔
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-black" />
        </button>

        {/* Separator */}
        <div className="h-8 w-px bg-zinc-800/60" />

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white leading-tight">
              {user.usuario}
            </p>
            <p className="text-[11px] text-zinc-500 capitalize">{userType}</p>
          </div>
          <div className="relative h-10 w-10 rounded-full bg-linear-to-br from-amber-300 via-rose-400 to-fuchsia-500 p-0.5 shadow-lg shadow-rose-500/10">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
              {user.usuario ? user.usuario.substring(0, 2).toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
