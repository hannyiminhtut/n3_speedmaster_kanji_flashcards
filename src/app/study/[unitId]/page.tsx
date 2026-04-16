"use client";
import React, { useState, useEffect } from "react";
import { useKanjiData, KanjiCard } from "@/lib/hooks/useKanjiData";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Shuffle, RotateCcw } from "lucide-react";

export default function StudyPage() {
    const params = useParams();
    const unitId = params?.unitId ? String(params.unitId) : "1";
    const router = useRouter();
    const { data, isLoaded } = useKanjiData();

    const [cards, setCards] = useState<KanjiCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            setCards(data.filter(c => c.unit === Number(unitId)));
        }
    }, [data, isLoaded, unitId]);

    if (!isLoaded) return <div className="p-8 text-center animate-pulse mt-20">Loading cards...</div>;

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh] bg-slate-50 dark:bg-slate-800/50 rounded-3xl mt-10">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">No cards found for Unit {unitId}</h2>
                <p className="text-slate-500 mb-6">Looks like you haven&apos;t added any Kanji words to this unit yet.</p>
                <button onClick={() => router.push("/manage")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-blue-500/30">
                    Go Add Data
                </button>
            </div>
        );
    }

    const handleNext = () => {
        if (isFlipped) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % cards.length);
            }, 300);
        } else {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }
    };

    const handlePrev = () => {
        if (isFlipped) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
            }, 300);
        } else {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }
    };

    const shuffleCards = () => {
        setIsFlipped(false);
        setTimeout(() => {
            const shuffled = [...cards].sort(() => Math.random() - 0.5);
            setCards(shuffled);
            setCurrentIndex(0);
        }, 300);
    };

    const currentCard = cards[currentIndex];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => router.push("/")} className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    <ArrowLeft className="w-5 h-5" /> Back to Units
                </button>
                <div className="text-sm font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-4 py-1.5 rounded-full shadow-sm">
                    Unit {unitId} &bull; Card {currentIndex + 1} of {cards.length}
                </div>
            </div>

            <div className="flex justify-center items-center gap-4 text-slate-500 mb-2">
                <button onClick={shuffleCards} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-blue-600 dark:text-blue-400 font-bold text-sm" title="Shuffle Cards">
                    <Shuffle className="w-4 h-4" /> Shuffle Deck
                </button>
            </div>

            <div className="relative w-full min-h-[60vh] sm:min-h-0 sm:aspect-[4/3] md:aspect-[3/2] cursor-pointer perspective-1000 group mx-auto mt-4" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                    className="w-full h-full relative preserve-3d transition-shadow hover:shadow-xl rounded-3xl"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                >
                    {/* Front Face */}
                    <div className="absolute w-full h-full glass-panel rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl backface-hidden bg-white dark:bg-slate-800 border dark:border-slate-700 border-slate-200">
                        <span className="text-blue-400/60 dark:text-blue-500/40 absolute top-6 right-6 flex items-center gap-2 font-bold uppercase text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"><RotateCcw className="w-4 h-4" /> Tap to flip</span>
                        <h2 className="text-6xl sm:text-8xl md:text-[140px] leading-tight text-center font-black font-jp text-slate-900 dark:text-white drop-shadow-sm select-none px-4 break-words">
                            {currentCard.kanji}
                        </h2>
                    </div>

                    {/* Back Face */}
                    <div className="absolute w-full h-full glass-panel rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl backface-hidden bg-blue-50 dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-900/50" style={{ transform: "rotateY(180deg)" }}>
                        <div className="space-y-8 text-center px-4 w-full select-none">
                            <div className="bg-white/50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-2xl w-full">
                                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 sm:mb-2">Meaning</p>
                                <h3 className="text-2xl sm:text-3xl md:text-5xl text-slate-900 dark:text-white font-extrabold break-words">{currentCard.meaning}</h3>
                            </div>
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 sm:p-6 rounded-2xl w-full">
                                <p className="text-xs font-black text-indigo-400/70 dark:text-indigo-500 uppercase tracking-widest mb-1 sm:mb-2">Burmese</p>
                                <h3 className="text-xl sm:text-2xl md:text-4xl text-indigo-700 dark:text-indigo-400 font-extrabold leading-tight break-words">{currentCard.burmese}</h3>
                            </div>
                        </div>
                        <span className="text-blue-400/60 dark:text-blue-500/40 absolute bottom-6 right-6 flex items-center gap-2 font-bold uppercase text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"><RotateCcw className="w-4 h-4" /> Tap to flip back</span>
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6 mt-8 sm:mt-12 pb-12 px-4 sm:px-0">
                <button onClick={handlePrev} className="flex-1 sm:max-w-[200px] flex justify-center items-center gap-2 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-2xl shadow-lg transition-all active:scale-95 font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">
                    <ChevronLeft className="w-6 h-6" /> <span>Previous</span>
                </button>
                <button onClick={handleNext} className="flex-1 sm:max-w-[200px] flex justify-center items-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95 font-bold">
                    <span>Next Card</span> <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
