import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biblioteca Pandora",
  description: "Plataforma de retos para niños: matemáticas y lectura crítica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/*
        Some browser extensions inject attributes into the <body> (for example
        `cz-shortcut-listen="true"`). If that happens only on the client it
        causes React hydration mismatch warnings in development. To reduce false
        positives during development we add the same attribute server-side as a
        harmless no-op. If you prefer, remove this attribute and disable the
        responsible extension in your browser (recommended for development).
      */}
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-black`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
