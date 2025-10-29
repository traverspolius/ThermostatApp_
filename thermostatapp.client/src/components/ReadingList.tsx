import { useEffect, useState } from 'react';
import { getReadings } from '../api/client';
import type { Reading, ApiError } from '../api/types';
import { formatExact, formatRelative } from '../lib/time';


export default function ReadingList({ refreshKey }: { refreshKey: number }) {
    const [items, setItems] = useState<Reading[] | null>(null); const [error, setError] = useState<string | null>(null);
    useEffect(() => { let alive = true; (async () => { try { setError(null); const d = await getReadings(20); if (alive) setItems(d); } catch (e) { const api = e as ApiError; setError(api.message || 'Failed to load readings'); } })(); return () => { alive = false }; }, [refreshKey]);
    if (error) return <div className="p-4 text-red-700">{error}</div>;
    if (items === null) return <div className="p-4">Loading…</div>;
    if (!items.length) return <div className="p-4 text-gray-600">No readings yet. Add your first above.</div>;
    return (
        <ul className="divide-y rounded-2xl border bg-white">
            {items.map(r => (
                <li key={r.id} className="p-4 flex items-start gap-4">
                    <div className="text-2xl font-semibold">{r.temperatureC.toFixed(1)}°C</div>
                    <div className="flex-1">
                        <div className="text-sm text-gray-700">
                            <span title={formatExact(r.createdAtUtc)}>{formatRelative(r.createdAtUtc)}</span>
                            {r.location && <span className="ml-2">• {r.location}</span>}
                        </div>
                        {r.notes && <div className="text-sm text-gray-900 mt-1">{r.notes}</div>}
                    </div>
                </li>
            ))}
        </ul>
    );
}