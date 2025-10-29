import type { CreateReadingRequest, Reading, ApiError } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || "https://localhost:7182/api";


async function handle<T>(res: Response): Promise<T> {
    if (res.ok) return res.json() as Promise<T>;
    let message = `HTTP ${res.status}`; let details: Record<string, string[]> | undefined;
    try { const d = await res.json(); message = d.title ?? d.detail ?? message; if (d.errors) details = d.errors; } catch { /* empty */ }
    const err: ApiError = { status: res.status, message, details }; throw err;
}

export async function createReading(body: CreateReadingRequest): Promise<Reading> {
    const res = await fetch(`${API_BASE}/readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return handle<Reading>(res);
}

export async function getReadings(take = 20): Promise<Reading[]> {
    const res = await fetch(`${API_BASE}/readings?take=${take}`);

    return handle<Reading[]>(res);
}