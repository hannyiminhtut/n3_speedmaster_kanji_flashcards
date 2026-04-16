"use client";
import Link from "next/link";
import { BookOpen, Database, Target, ArrowRight } from "lucide-react";
import { useKanjiData } from "@/lib/hooks/useKanjiData";

const TOTAL_UNITS = 9;

export default function HomePage() {
  const { data, isLoaded } = useKanjiData();

  if (!isLoaded) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading dashboard...</div>;
  }

  // Calculate stats
  const totalKanji = data.length;
  const unitStats = Array.from({ length: TOTAL_UNITS }).map((_, idx) => {
    const unit = idx + 1;
    return {
      unit,
      count: data.filter(k => k.unit === unit).length
    };
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">N3 Speed Master Kanji</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Study effectively using interactive flashcards, designed beautifully for your daily progress. You have saved <strong className="text-blue-600 dark:text-blue-400">{totalKanji}</strong> kanji so far.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/manage" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
            <Database className="w-5 h-5" />
            Manage Kanji Data
          </Link>
        </div>
      </section>

      {/* Overview of Units */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b dark:border-slate-800 pb-4">
          <Target className="w-6 h-6 text-indigo-500" />
          <h2 className="text-2xl font-bold">Study Units</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {unitStats.map(stat => (
            <div key={stat.unit} className="group glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:shadow-none hover:border-blue-300 dark:hover:border-blue-500/50">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                  {stat.unit}
                </div>
                {stat.count > 0 ? (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                    {stat.count} Cards
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full">
                    Empty
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold mb-1">Unit {stat.unit}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Practice kanji from section {stat.unit}.
              </p>

              <Link
                href={stat.count > 0 ? `/study/${stat.unit}` : "#"}
                className={`flex items-center justify-between w-full p-3 rounded-lg font-medium transition-colors ${stat.count > 0
                    ? "bg-slate-50 dark:bg-slate-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 group-hover:bg-blue-600 group-hover:text-white"
                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed"
                  }`}
              >
                <span>{stat.count > 0 ? "Study Now" : "Need Data"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
