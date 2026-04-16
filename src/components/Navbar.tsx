"use client";
import Link from "next/link";
import { BookOpen, Database, Target } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 glass-panel border-b mb-6">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-[var(--color-primary-600)] dark:text-[var(--color-primary-500)]">
                    <Target className="w-6 h-6" />
                    <span>N3 Kanji</span>
                </Link>
                <div className="flex gap-4 sm:gap-6">
                    <Link href="/" className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--color-primary-600)] ${pathname === "/" || pathname.startsWith("/study") ? "text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" : "text-slate-600 dark:text-slate-300"}`}>
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Study Units</span>
                    </Link>
                    <Link href="/manage" className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--color-primary-600)] ${pathname === "/manage" ? "text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" : "text-slate-600 dark:text-slate-300"}`}>
                        <Database className="w-4 h-4" />
                        <span className="hidden sm:inline">Manage Data</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
