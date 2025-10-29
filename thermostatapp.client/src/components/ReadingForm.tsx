import { useState } from 'react';
import { createReading } from '../api/client';
import type { CreateReadingRequest, ApiError } from '../api/types';


const initial: CreateReadingRequest = { temperatureC: 20 };
const validate = (v: CreateReadingRequest) => {
    const e: Record<string, string> = {};
    if (v.temperatureC === undefined || Number.isNaN(v.temperatureC)) e.temperatureC = 'Temperature is required';
    else if (v.temperatureC < -50 || v.temperatureC > 60) e.temperatureC = 'Must be between -50 and 60 °C';
    if (v.location && v.location.length > 64) e.location = 'Max 64 characters';
    if (v.notes && v.notes.length > 256) e.notes = 'Max 256 characters';
    return e;
};


export default function ReadingForm({ onCreated }: { onCreated: () => void }) {
    const [form, setForm] = useState<CreateReadingRequest>(initial);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [busy, setBusy] = useState(false); const [ok, setOk] = useState<string | null>(null); const [err, setErr] = useState<string | null>(null);
    async function submit(e: React.FormEvent) {
        e.preventDefault(); setOk(null); setErr(null); const v = validate(form); setErrors(v); if (Object.keys(v).length) return;
        setBusy(true); try { await createReading(form); setForm(initial); setOk('Saved reading.'); onCreated(); }
        catch (ex) { const api = ex as ApiError; if (api.details) { const m: Record<string, string> = {}; for (const k of Object.keys(api.details)) m[k] = api.details[k][0]; setErrors(m); } setErr(api.message || 'Something went wrong.'); }
        finally { setBusy(false); }
    }
    return (
        <form onSubmit={submit} className="space-y-4 p-4 border rounded-2xl shadow-sm bg-white">
            <h2 className="text-xl font-semibold">New Reading</h2>
            <div>
                <label htmlFor="temperatureC" className="block text-sm font-medium">Temperature (°C)</label>
                <input id="temperatureC" type="number" step="0.1" className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring" value={form.temperatureC}
                    onChange={e => setForm({ ...form, temperatureC: Number(e.target.value) })} required />
                {errors.temperatureC && <p className="text-sm text-red-600 mt-1">{errors.temperatureC}</p>}
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium">Location (optional)</label>
                <input id="location" className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring" value={form.location ?? ''}
                    onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g., Living Room" />
                {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-medium">Notes (optional)</label>
                <textarea id="notes" rows={3} className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring" value={form.notes ?? ''}
                    onChange={e => setForm({ ...form, notes: e.target.value })} />
                {errors.notes && <p className="text-sm text-red-600 mt-1">{errors.notes}</p>}
            </div>
            {err && <div className="text-sm text-red-700">{err}</div>}
            {ok && <div className="text-sm text-green-700">{ok}</div>}
            <button type="submit" disabled={busy} className="inline-flex items-center rounded-xl px-4 py-2 bg-black text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save Reading'}</button>
        </form>
    );
}