import { useState } from "react";
import ReadingForm from "./components/ReadingForm";
import ReadingList from "./components/ReadingList";

export default function App() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-white text-slate-800">
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl border border-white/60 ring-1 ring-slate-900/5 p-8 space-y-8">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                                <span role="img" aria-label="thermometer">
                                    🌡️
                                </span>
                                <span>Thermostat Readings</span>
                            </h1>
                            <p className="text-sm text-slate-500">
                                Log temperature, location, and notes. View the latest 20
                                readings (newest first).
                            </p>
                        </div>

                        <div className="text-xs text-slate-400 text-right leading-tight">
                            <div className="font-medium text-slate-500">
                                Built by Travers Polius
                            </div>
                            <div>v1.0</div>
                        </div>
                    </header>

                    {/* Form */}
                    <ReadingForm
                        onCreated={() => {
                            setRefreshKey((k) => k + 1);
                        }}
                    />

                    {/* List */}
                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                            Latest Readings
                        </h2>
                        <ReadingList refreshKey={refreshKey} />
                    </section>

                    {/* Footer credit (small, tasteful) */}
                    <footer className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
                        ThermostatApp • Full-stack demo using ASP.NET Core + React +
                        Tailwind • © {new Date().getFullYear()} Travers Polius
                    </footer>
                </div>
            </div>
        </div>
    );
}
