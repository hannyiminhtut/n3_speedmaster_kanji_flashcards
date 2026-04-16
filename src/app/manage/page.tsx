"use client";
import React, { useState, useRef } from "react";
import { useKanjiData, KanjiCombination } from "@/lib/hooks/useKanjiData";
import { Save, Download, Upload, Trash2, PlusCircle, AlertCircle, Database, Plus, X } from "lucide-react";

export default function ManagePage() {
    const { data, isLoaded, addCard, deleteCard, importData, clearAllData } = useKanjiData();

    const [form, setForm] = useState({
        unit: 1,
        kanji: "",
        mainMeaning: "",
        combinations: [{ id: crypto.randomUUID(), word: "", meaning: "" }] as KanjiCombination[]
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isLoaded) return <div className="p-8 text-center animate-pulse">Loading...</div>;

    const handleAddCombination = () => {
        setForm(prev => ({
            ...prev,
            combinations: [...prev.combinations, { id: crypto.randomUUID(), word: "", meaning: "" }]
        }));
    };

    const handleRemoveCombination = (id: string) => {
        setForm(prev => ({
            ...prev,
            combinations: prev.combinations.filter(c => c.id !== id)
        }));
    };

    const handleCombinationChange = (id: string, field: "word" | "meaning", value: string) => {
        setForm(prev => ({
            ...prev,
            combinations: prev.combinations.map(c =>
                c.id === id ? { ...c, [field]: value } : c
            )
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.kanji.trim() || !form.mainMeaning.trim()) return;

        // Filter out completely empty combinations before saving
        const validCombinations = form.combinations.filter(c => c.word.trim() || c.meaning.trim());

        addCard({
            unit: form.unit,
            kanji: form.kanji,
            mainMeaning: form.mainMeaning,
            combinations: validCombinations
        });

        // Reset form, keeping the same unit
        setForm(prev => ({
            ...prev,
            kanji: "",
            mainMeaning: "",
            combinations: [{ id: crypto.randomUUID(), word: "", meaning: "" }]
        }));
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "n3-kanji-backup.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target?.result as string);
                if (Array.isArray(importedData)) {
                    importData(importedData);
                    alert("Data imported successfully!");
                }
            } catch (error) {
                alert("Invalid JSON format!");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Database className="w-8 h-8 text-blue-600" />
                        Manage Data
                    </h1>
                    <p className="text-slate-500 mt-1">Add kanji cards and their combinations.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={handleExport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition font-medium text-sm">
                        <Download className="w-4 h-4" /> Export JSON
                    </button>
                    <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition font-medium text-sm">
                        <Upload className="w-4 h-4" /> Import JSON
                        <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ADD CARD FORM */}
                <section className="glass-panel p-6 sm:p-8 rounded-2xl h-fit shadow-xl shadow-blue-500/5">
                    <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                        <PlusCircle className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Add New Card</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Unit Assignment</label>
                            <select
                                value={form.unit}
                                onChange={(e) => setForm({ ...form, unit: Number(e.target.value) })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition font-medium cursor-pointer"
                            >
                                {[...Array(9)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>Unit {i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-blue-50 dark:bg-slate-800/50 p-4 rounded-xl border border-blue-100 dark:border-slate-700 space-y-4">
                            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest">Main Kanji</h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kanji Character</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. 会"
                                    value={form.kanji}
                                    onChange={(e) => setForm({ ...form, kanji: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition text-2xl font-jp"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Burmese Meaning</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. တွေ့ဆုံခြင်း"
                                    value={form.mainMeaning}
                                    onChange={(e) => setForm({ ...form, mainMeaning: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Combinations</h3>
                                <button type="button" onClick={handleAddCombination} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-sm font-bold transition">
                                    <Plus className="w-4 h-4" /> Add Row
                                </button>
                            </div>

                            {form.combinations.map((c, index) => (
                                <div key={c.id} className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 dark:bg-slate-800/30 p-2 sm:p-0 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none">
                                    <span className="hidden sm:inline font-bold text-slate-400 w-6 text-center">{index + 1}.</span>
                                    <input
                                        type="text"
                                        placeholder="Word (e.g. 会社)"
                                        value={c.word}
                                        onChange={(e) => handleCombinationChange(c.id, "word", e.target.value)}
                                        className="flex-1 w-full bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 transition font-jp text-lg"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Meaning (e.g. ကုမ္ပဏီ)"
                                        value={c.meaning}
                                        onChange={(e) => handleCombinationChange(c.id, "meaning", e.target.value)}
                                        className="flex-1 w-full bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCombination(c.id)}
                                        disabled={form.combinations.length === 1}
                                        className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-400 transition ml-auto sm:ml-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="w-full flex justify-center items-center gap-2 py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-[0.98]">
                            <Save className="w-5 h-5" /> Save Card to Unit {form.unit}
                        </button>
                    </form>
                </section>

                {/* LIST EXISTING */}
                <section className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col h-[700px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Existing Cards ({data.length})</h2>
                        {data.length > 0 && (
                            <button
                                onClick={clearAllData}
                                className="text-red-500 hover:text-white bg-red-50 hover:bg-red-500 dark:bg-red-900/20 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                                title="Clear All Cards"
                            >
                                <AlertCircle className="w-4 h-4" /> Clear All
                            </button>
                        )}
                    </div>

                    <div className="overflow-y-auto space-y-3 pr-2 flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                        {data.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 italic bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed dark:border-slate-700">
                                <Database className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2" />
                                <p>No cards added yet.</p>
                                <p className="text-sm mt-1 text-slate-400">Add your first Kanji to the left!</p>
                            </div>
                        ) : (
                            [...data].reverse().map(card => (
                                <div key={card.id} className="group relative flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-lg transition-all dark:shadow-none">
                                    <div className="flex-1 pr-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800/30">
                                                    U{card.unit}
                                                </span>
                                                <span className="font-extrabold text-2xl font-jp tracking-wider text-slate-900 dark:text-white">
                                                    {card.kanji}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 border-l-0 sm:border-l-2 border-slate-200 dark:border-slate-700 pl-0 sm:pl-4">{card.mainMeaning}</span>
                                        </div>
                                        {card.combinations && card.combinations.length > 0 && (
                                            <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 inline-block px-2 py-1 rounded">
                                                {card.combinations.length} Combination{card.combinations.length > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteCard(card.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                        title="Delete Card"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
