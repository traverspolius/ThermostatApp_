import { useEffect, useState } from "react";
import { getReadings } from "../api/client";
import type { Reading, ApiError } from "../api/types";
import { formatExact, formatRelative } from "../lib/time";

export default function ReadingList({
    refreshKey,
}: {
    refreshKey: number;
}) {
    const [items, setItems] = useState<Reading[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setError(null);
                const data = await getReadings(20);
                if (alive) setItems(data);
            } catch (e) {
                const api = e as ApiError;
                setError(api.message || "Failed to load readings.");
            }
        })();
        return () => {
            alive = false;
        };
    }, [refreshKey]);

    if (error) {
        return (
            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
            </div>
        );
    }

    if (items === null) {
        return (
            <div className="p-4 text-slate-500 text-sm">
                Loading latest readings…
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="p-4 text-slate-500 text-sm bg-white border border-slate-200 rounded-xl shadow-sm ring-1 ring-slate-900/5">
                No readings yet. Add your first one above.
            </div>
        );
    }

    return (
        <ul className="space-y-3">
            {items.map((r) => (
                <li
                    key={r.id}
                    className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/5"
                >
                    <div className="text-2xl font-semibold text-slate-800">
                        {r.temperatureC.toFixed(1)}&deg;C
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-600">
                            <span
                                className="text-slate-700 font-medium"
                                title={formatExact(r.createdAtUtc)}
                            >
                                {formatRelative(r.createdAtUtc)}
                            </span>
                            {r.location && (
                                <span className="text-slate-400"> {r.location}</span>
                            )}
                        </div>

                        {r.notes && (
                            <div className="text-slate-700 text-sm mt-1 break-words">
                                {r.notes}
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}
