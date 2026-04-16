"use client";
import React, { useState, useRef } from "react";
import { useKanjiData } from "@/lib/hooks/useKanjiData";
import { Save, Download, Upload, Trash2, PlusCircle, AlertCircle, Database } from "lucide-react";

export default function ManagePage() {
    const { data, isLoaded, addCard, deleteCard, importData, clearAllData } = useKanjiData();

    const [form, setForm] = useState({
        kanji: "",
        meaning: "",
        burmese: "",
        unit: 1
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isLoaded) return <div className="p-8 text-center animate-pulse">Loading...</div>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.kanji.trim() || !form.meaning.trim() || !form.burmese.trim()) return;

        addCard(form);

        // Reset kanji and meaning, keeping the same unit to make bulk entry faster
        setForm(prev => ({
            ...prev,
            kanji: "",
            meaning: "",
            burmese: ""
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
                    <p className="text-slate-500 mt-1">Add, backup, and organize your Kanji vocabulary.</p>
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

                    <form onSubmit={handleSubmit} className="space-y-5">
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

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kanji / Word</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. 会社"
                                value={form.kanji}
                                onChange={(e) => setForm({ ...form, kanji: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition text-2xl font-jp"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Original Meaning (English)</label>
                            <input
                                required
                                type="text"
                                placeholder="Company"
                                value={form.meaning}
                                onChange={(e) => setForm({ ...form, meaning: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Burmese Translation</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. ကုမ္ပဏီ"
                                value={form.burmese}
                                onChange={(e) => setForm({ ...form, burmese: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
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
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800/30">
                                                U{card.unit}
                                            </span>
                                            <span className="font-extrabold text-xl font-jp tracking-wider text-slate-900 dark:text-white">
                                                {card.kanji}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                            <span>{card.meaning}</span>
                                            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                                            <span className="text-indigo-600 dark:text-indigo-400">{card.burmese}</span>
                                        </div>
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
