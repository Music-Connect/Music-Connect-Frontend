import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Music Connect - Conectando Artistas e Contratantes",
  description:
    "Plataforma para conexão entre artistas e contratantes através da música",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}
