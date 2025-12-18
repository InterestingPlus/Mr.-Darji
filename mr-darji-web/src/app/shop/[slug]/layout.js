import { Geist, Geist_Mono } from "next/font/google";

export default function RootLayout({ children }) {
  return (
    <>
      <header className="p-4 border-b">Tailor App</header>

      {children}

      <footer className="p-4 border-t text-sm text-center">
        © 2025 Tailor App
      </footer>
    </>
  );
}
