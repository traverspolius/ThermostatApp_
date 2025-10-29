export const formatExact = (iso: string) => new Date(iso).toLocaleString();
export function formatRelative(iso: string) {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }); const now = Date.now(); const t = new Date(iso).getTime(); const diff = t - now; const abs = Math.abs(diff);
    const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536e6], ['month', 2592e6], ['day', 864e5], ['hour', 36e5], ['minute', 6e4], ['second', 1e3]];
    for (const [u, ms] of units) { if (abs >= ms || u === 'second') return rtf.format(Math.round(diff / ms), u); } return formatExact(iso);
}