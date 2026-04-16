"use client";
import { useState, useEffect } from "react";

export type KanjiCard = {
    id: string;
    kanji: string;
    meaning: string;
    burmese: string;
    unit: number; // 1 through 9
};

export const INITIAL_KANJI_DATA: KanjiCard[] = [];

export function useKanjiData() {
    const [data, setData] = useState<KanjiCard[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("n3_kanji_data");
            if (stored) {
                setData(JSON.parse(stored));
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

    const importData = (importedCards: KanjiCard[]) => {
        // Basic validation could be added here
        saveToLocalStorage(importedCards);
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
