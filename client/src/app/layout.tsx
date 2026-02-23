"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (pathname !== "/login") {
      // For demo, we don't force redirect, but you can:
      // router.push("/login");
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0a0c10]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight">EcoEngage</Link>

            <div className="flex items-center gap-8">
              <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
                <Link href="/" className="hover:text-primary transition-colors">Feed</Link>
                <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                <Link href="/agent" className="hover:text-primary transition-colors">Agent Chat</Link>
              </div>

              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-200 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                      <User size={14} className="text-primary" />
                      <span>{user.username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm font-bold text-white bg-primary px-5 py-2 rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
