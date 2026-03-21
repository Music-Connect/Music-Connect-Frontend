"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ href, label = "Voltar", className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group inline-flex items-center gap-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3 py-1.5 text-[13px] font-medium text-zinc-500 backdrop-blur-sm transition-all duration-200 hover:border-zinc-700/80 hover:bg-zinc-900/70 hover:text-zinc-200 active:scale-[0.97] ${className}`}
    >
      <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
        <ArrowLeft size={14} />
      </span>
      {label}
    </button>
  );
}
