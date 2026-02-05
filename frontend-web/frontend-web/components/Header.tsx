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
    <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-900 bg-black/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar artistas, gêneros..."
            value={searchTerm || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
            🔍
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-white">{user.usuario}</p>
          <p className="text-xs text-zinc-500 capitalize">{userType}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-yellow-300 to-pink-500 p-0.5">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-sm">
            {user.usuario ? user.usuario.substring(0, 2).toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
