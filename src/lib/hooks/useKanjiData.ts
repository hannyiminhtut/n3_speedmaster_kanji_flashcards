"use client";
import { useState, useEffect } from "react";

export type KanjiCombination = {
    id: string;
    word: string;
    meaning: string;
};

export type KanjiCard = {
    id: string;
    kanji: string;
    mainMeaning: string;
    combinations: KanjiCombination[];
    unit: number;
    // Legacy fields for fallback mapping
    meaning?: string;
    burmese?: string;
};

export const INITIAL_KANJI_DATA: KanjiCard[] = [];

export function useKanjiData() {
    const [data, setData] = useState<KanjiCard[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("n3_kanji_data");
            if (stored) {
                let parsed = JSON.parse(stored);

                // Auto-migration for legacy cards that had separate "meaning" and "burmese" fields
                parsed = parsed.map((card: any) => {
                    if (!card.combinations) {
                        return {
                            id: card.id,
                            kanji: card.kanji,
                            mainMeaning: card.meaning && card.burmese ? `${card.meaning} / ${card.burmese}` : (card.burmese || card.meaning),
                            combinations: [],
                            unit: card.unit
                        };
                    }
                    return card;
                });

                setData(parsed);
            } else {
                setData(INITIAL_KANJI_DATA);
            }
        } catch (error) {
            console.error("Failed to load Kanji data from localStorage", error);
            setData(INITIAL_KANJI_DATA);
        }
        setIsLoaded(true);
    }, []);

    const saveToLocalStorage = (newData: KanjiCard[]) => {
        setData(newData);
        localStorage.setItem("n3_kanji_data", JSON.stringify(newData));
    };

    const addCard = (card: Omit<KanjiCard, "id">) => {
        const newCard = { ...card, id: crypto.randomUUID() };
        saveToLocalStorage([...data, newCard]);
    };

    const updateCard = (updatedCard: KanjiCard) => {
        saveToLocalStorage(data.map(c => c.id === updatedCard.id ? updatedCard : c));
    };

    const deleteCard = (id: string) => {
        saveToLocalStorage(data.filter(c => c.id !== id));
    };

    const importData = (importedCards: any[]) => {
        // Run migration on import as well so old exports still work nicely
        const migrated = importedCards.map((card: any) => {
            if (!card.combinations) {
                return {
                    id: card.id || crypto.randomUUID(),
                    kanji: card.kanji,
                    mainMeaning: card.meaning && card.burmese ? `${card.meaning} / ${card.burmese}` : (card.burmese || card.meaning),
                    combinations: [],
                    unit: card.unit
                };
            }
            return card;
        });
        saveToLocalStorage(migrated);
    };

    const clearAllData = () => {
        if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
            saveToLocalStorage([]);
        }
    };

    return {
        data,
        isLoaded,
        addCard,
        updateCard,
        deleteCard,
        importData,
        clearAllData
    };
}
