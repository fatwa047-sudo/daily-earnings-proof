import { useEffect, useState } from "react";

export type Entry = { id: string; date: string; amount: number; source: string; note: string };
export type Profile = { name: string; work: string; location: string; phone: string; currency: string };

const EK = "workproof.entries";
const PK = "workproof.profile";
export const defaultProfile: Profile = { name: "", work: "Boda rider", location: "", phone: "", currency: "KES" };

function usePersisted<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) try { setVal(JSON.parse(raw)); } catch { /* ignore */ }
    setReady(true);
  }, [key]);
  useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(val)); }, [key, val, ready]);
  return [val, setVal, ready] as const;
}

export const useEntries = () => usePersisted<Entry[]>(EK, []);
export const useProfile = () => usePersisted<Profile>(PK, defaultProfile);

export function summarize(entries: Entry[], from: string, to: string) {
  const inRange = entries.filter((e) => e.date >= from && e.date <= to).sort((a, b) => a.date.localeCompare(b.date));
  const total = inRange.reduce((s, e) => s + e.amount, 0);
  const days = new Set(inRange.map((e) => e.date)).size;
  const months = new Map<string, number>();
  for (const e of inRange) months.set(e.date.slice(0, 7), (months.get(e.date.slice(0, 7)) ?? 0) + e.amount);
  const span = Math.max(1, (new Date(to).getTime() - new Date(from).getTime()) / 86400000 + 1);
  return { inRange, total, days, months: [...months.entries()], avgPerWorkDay: days ? total / days : 0, avgMonthly: (total / span) * 30.4 };
}

export const money = (n: number, c: string) => `${c} ${Math.round(n).toLocaleString()}`;
export const today = () => new Date().toISOString().slice(0, 10);
export const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
