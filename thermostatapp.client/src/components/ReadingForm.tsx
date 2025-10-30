import { useState } from "react";
import { createReading } from "../api/client";
import type { CreateReadingRequest, ApiError } from "../api/types";

const initial: CreateReadingRequest = { temperatureC: 20 };

const validate = (v: CreateReadingRequest) => {
    const e: Record<string, string> = {};
    if (v.temperatureC === undefined || Number.isNaN(v.temperatureC)) {
        e.temperatureC = "Temperature is required.";
    } else if (v.temperatureC < -50 || v.temperatureC > 60) {
        e.temperatureC = "Must be between -50 and 60 °C.";
    }

    if (v.location && v.location.length > 64) {
        e.location = "Max 64 characters.";
    }
    if (v.notes && v.notes.length > 256) {
        e.notes = "Max 256 characters.";
    }
    return e;
};

export default function ReadingForm({
    onCreated,
}: {
    onCreated: () => void;
}) {
    const [form, setForm] = useState<CreateReadingRequest>(initial);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<
        "idle" | "saving" | "success" | "error"
    >("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("idle");
        setErrorMessage(null);

        // client-side validation
        const v = validate(form);
        setErrors(v);
        if (Object.keys(v).length) return;

        setBusy(true);
        setStatus("saving");

        try {
            await createReading(form);
            setForm(initial);
            setErrors({});
            setStatus("success");
            onCreated();
        } catch (ex) {
            const api = ex as ApiError;
            if (api.details) {
                const m: Record<string, string> = {};
                for (const k of Object.keys(api.details)) {
                    m[k] = api.details[k][0];
                }
                setErrors(m);
            }
            setErrorMessage(api.message || "Something went wrong.");
            setStatus("error");
        } finally {
            setBusy(false);
        }
    }

    return (
        <form
            onSubmit={submit}
            className="rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5 p-6 space-y-6"
        >
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                        New Reading
                    </h2>
                    <p className="text-sm text-slate-500">
                        Temperature is required. Location/notes are optional.
                    </p>
                </div>

                {/* status pill */}
                {status === "saving" && (
                    <span className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                        Saving…
                    </span>
                )}
                {status === "success" && (
                    <span className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-600 border border-green-200">
                        Saved!
                    </span>
                )}
                {status === "error" && (
                    <span className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200">
                        Error
                    </span>
                )}
            </div>

            {/* Temperature */}
            <div>
                <label
                    htmlFor="temperatureC"
                    className="block text-sm font-medium text-slate-700"
                >
                    Temperature (&deg;C) <span className="text-red-500">*</span>
                </label>
                <input
                    id="temperatureC"
                    type="number"
                    step="0.1"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.temperatureC}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            temperatureC: Number(e.target.value),
                        })
                    }
                    required
                />
                {errors.temperatureC && (
                    <p className="text-sm text-red-600 mt-1">{errors.temperatureC}</p>
                )}
            </div>

            {/* Location */}
            <div>
                <label
                    htmlFor="location"
                    className="block text-sm font-medium text-slate-700"
                >
                    Location <span className="text-slate-400">(optional)</span>
                </label>
                <input
                    id="location"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Living Room"
                    value={form.location ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            location: e.target.value,
                        })
                    }
                />
                {errors.location && (
                    <p className="text-sm text-red-600 mt-1">{errors.location}</p>
                )}
            </div>

            {/* Notes */}
            <div>
                <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-slate-700"
                >
                    Notes <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                    id="notes"
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Any observations..."
                    value={form.notes ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            notes: e.target.value,
                        })
                    }
                />
                {errors.notes && (
                    <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
                )}
            </div>

            {/* General error */}
            {errorMessage && (
                <div className="text-sm text-red-600">{errorMessage}</div>
            )}

            <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white 
                   text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                {busy ? "Saving…" : "Save Reading"}
            </button>
        </form>
    );
}
