"use client";
import React, { useState, useEffect } from "react";
import { useKanjiData, KanjiCard } from "@/lib/hooks/useKanjiData";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Shuffle, RotateCcw, List } from "lucide-react";

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

    // Handle initial loading rendering
    if (!isLoaded) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh]">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading flashes...</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center h-[60vh] bg-slate-50 dark:bg-slate-800/50 rounded-3xl mt-6 mx-4 sm:mx-0">
                <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">No cards found</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven&apos;t added any Kanji words to Unit {unitId} yet.</p>
                <button onClick={() => router.push("/manage")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg shadow-blue-500/30">
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
        <div className="max-w-3xl mx-auto w-full px-2 sm:px-4 flex flex-col h-[calc(100vh-80px)] sm:h-auto">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 pt-2 shrink-0">
                <div className="flex items-center justify-between w-full sm:w-auto">
                    <button onClick={() => router.push("/")} className="flex items-center gap-1.5 font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    {/* On mobile, show unit count aligned right */}
                    <div className="sm:hidden text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full shadow-sm">
                        U{unitId} &bull; {currentIndex + 1} / {cards.length}
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    {/* On desktop, show unit count here */}
                    <div className="hidden sm:block text-sm font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-4 py-1.5 rounded-full shadow-sm">
                        Unit {unitId} &bull; Card {currentIndex + 1} of {cards.length}
                    </div>

                    <button onClick={shuffleCards} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm w-full sm:w-auto" title="Shuffle Deck">
                        <Shuffle className="w-4 h-4" /> Shuffle
                    </button>
                </div>
            </div>

            {/* Main Flashcard Container */}
            {/* CRITICAL FIX: explicit height (h-[55vh]) so absolute children can inherit height bounds! */}
            <div
                className="relative w-full h-[55vh] min-h-[400px] sm:min-h-[500px] md:h-[550px] cursor-pointer perspective-1000 group mx-auto shrink-0 z-10"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d transition-shadow sm:hover:shadow-xl rounded-[2rem]"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                >
                    {/* FRONT FACE: MAIN KANJI & MEANING */}
                    <div className="absolute inset-0 w-full h-full glass-panel rounded-[2rem] flex flex-col items-center justify-between p-6 sm:p-10 shadow-2xl backface-hidden bg-white dark:bg-slate-800 border sm:border-slate-200 dark:border-slate-700 overflow-hidden">

                        <div className="w-full flex justify-end">
                            <span className="text-blue-400/60 dark:text-blue-500/40 flex items-center gap-1.5 font-bold uppercase text-[10px] sm:text-xs tracking-wider opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Tap to flip
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 py-4">
                            <h2 className="text-[100px] sm:text-[130px] md:text-[160px] leading-none text-center font-black font-jp text-slate-900 dark:text-white drop-shadow-sm select-none break-words shrink">
                                {currentCard.kanji}
                            </h2>
                        </div>

                        <div className="w-full bg-indigo-50/80 dark:bg-indigo-900/40 px-4 sm:px-6 py-4 sm:py-5 rounded-3xl border border-indigo-100/50 dark:border-indigo-800/30 flex items-center justify-center mt-auto shrink-0 shadow-inner">
                            <h3 className="text-xl sm:text-2xl md:text-3xl text-indigo-700 dark:text-indigo-400 font-extrabold text-center select-none w-full break-words whitespace-normal leading-snug">
                                {currentCard.mainMeaning}
                            </h3>
                        </div>
                    </div>

                    {/* BACK FACE: COMBINATIONS */}
                    <div className="absolute inset-0 w-full h-full glass-panel rounded-[2rem] flex flex-col items-center pt-6 pb-5 px-3 sm:px-8 shadow-2xl backface-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" style={{ transform: "rotateY(180deg)" }}>
                        <div className="flex items-center justify-center gap-2 w-full pb-3 mb-2 shrink-0">
                            <List className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-wide">Combinations</h3>
                        </div>

                        {/* Scrollable list of combinations */}
                        <div
                            className="w-full flex-1 overflow-y-auto overflow-x-hidden space-y-2.5 sm:space-y-3 px-1.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 pb-2"
                            onClick={(e) => {
                                // Allow internal scrolling on long lists without flipping the card.
                                e.stopPropagation();
                            }}
                        >
                            {currentCard.combinations && currentCard.combinations.length > 0 ? (
                                currentCard.combinations.map((comb) => (
                                    <div key={comb.id} className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 shadow-sm relative overflow-hidden">
                                        <div className="text-2xl sm:text-3xl font-black font-jp tracking-wide text-slate-900 dark:text-white select-text z-10 w-full sm:w-auto">
                                            {comb.word}
                                        </div>
                                        <div className="text-[15px] sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 text-left sm:text-right select-text z-10 break-words flex-1">
                                            {comb.meaning}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-10 px-6 text-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <span className="text-4xl mb-3">🪹</span>
                                    <p className="font-medium text-sm">No combinations added to this card.</p>
                                </div>
                            )}
                        </div>

                        {/* Explicit button at the bottom to flip back since we stopped propagation on the scroll container */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                            className="w-[calc(100%-16px)] sm:w-full mt-3 py-3.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition shrink-0 active:scale-95"
                        >
                            <RotateCcw className="w-4 h-4" /> Flip Card
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-center items-center gap-3 sm:gap-6 mt-auto pb-4 pt-6 sm:py-8 shrink-0 relative z-20">
                <button onClick={handlePrev} className="flex-1 max-w-[180px] flex justify-center items-center gap-1 sm:gap-2 py-4 sm:py-4 bg-white dark:bg-slate-800 border sm:border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-[1.25rem] shadow-sm hover:shadow-md transition-all active:scale-95 font-black uppercase text-xs sm:text-sm tracking-wider text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white select-none">
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" /> <span>Prev</span>
                </button>
                <button onClick={handleNext} className="flex-1 max-w-[180px] flex justify-center items-center gap-1 sm:gap-2 py-4 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95 font-black uppercase text-xs sm:text-sm tracking-wider select-none">
                    <span>Next</span> <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>
        </div>
    );
}
