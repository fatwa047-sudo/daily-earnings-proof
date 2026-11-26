import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEntries, useProfile, summarize, money, today, daysAgo } from "@/lib/workproof";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkProof — Log your daily earnings" },
      { name: "description", content: "Boda riders, gig workers and traders: log daily income and build proof for loans, rent and visas." },
      { property: "og:title", content: "WorkProof — Log your daily earnings" },
      { property: "og:description", content: "Turn informal work into a verifiable income record." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SOURCES = ["Boda trips", "Market sales", "Delivery app", "Ride-hailing", "Casual job", "Other"];

function Index() {
  const [entries, setEntries] = useEntries();
  const [profile, setProfile] = useProfile();
  const [date, setDate] = useState(today());
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState(SOURCES[0] ?? "Other");
  const [note, setNote] = useState("");
  const s30 = summarize(entries, daysAgo(29), today());

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!n || n <= 0) return;
    setEntries([{ id: crypto.randomUUID(), date, amount: n, source, note: note.trim() }, ...entries]);
    setAmount(""); setNote("");
  };
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen">
      <header className="bg-hero text-primary-foreground">
        <div className="stripe-ticket h-2" />
        <div className="mx-auto max-w-5xl px-5 py-10">
          <p className="text-sm uppercase tracking-[0.2em] opacity-80">SDG 8 · SDG 10</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold">WorkProof</h1>
          <p className="mt-3 max-w-xl text-lg opacity-90">No payslip? No problem. Log what you earn each day and print a one-page income statement for loans, rent or visas.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
            <Stat label="Last 30 days" value={money(s30.total, profile.currency)} />
            <Stat label="Days worked" value={String(s30.days)} />
            <Stat label="Avg / work day" value={money(s30.avgPerWorkDay, profile.currency)} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-5 py-8 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <form onSubmit={add} className="rounded-xl border bg-card p-5 shadow-card space-y-3">
            <h2 className="font-display text-2xl font-semibold">Log today's earnings</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date"><Input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} /></Field>
              <Field label={`Amount (${profile.currency})`}><Input inputMode="decimal" type="number" min="1" placeholder="1500" value={amount} onChange={(e) => setAmount(e.target.value)} required /></Field>
            </div>
            <Field label="Source">
              <select className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm" value={source} onChange={(e) => setSource(e.target.value)}>
                {SOURCES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Note (optional)"><Input placeholder="e.g. 12 trips, Gikomba stall" value={note} onChange={(e) => setNote(e.target.value)} /></Field>
            <Button type="submit" className="w-full" size="lg">Add entry</Button>
          </form>

          <div className="rounded-xl border bg-card p-5 shadow-card space-y-3">
            <h2 className="font-display text-2xl font-semibold">Your details</h2>
            <p className="text-sm text-muted-foreground">Shown on your statement.</p>
            <Field label="Full name"><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Amina Wanjiru" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type of work"><Input value={profile.work} onChange={(e) => setProfile({ ...profile, work: e.target.value })} /></Field>
              <Field label="Currency"><Input value={profile.currency} onChange={(e) => setProfile({ ...profile, currency: e.target.value.toUpperCase().slice(0, 4) })} /></Field>
              <Field label="Location"><Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="Nairobi" /></Field>
              <Field label="Phone"><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+254 7…" /></Field>
            </div>
            <Button asChild variant="secondary" className="w-full" size="lg">
              <Link to="/statement"><FileText /> Get income statement</Link>
            </Button>
          </div>
        </div>

        <section className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-display text-2xl font-semibold">Earnings log</h2>
          {sorted.length === 0 ? (
            <p className="mt-6 rounded-lg bg-muted p-6 text-center text-muted-foreground">No entries yet. Add your first day's earnings — every day you log makes your record stronger.</p>
          ) : (
            <ul className="mt-4 divide-y">
              {sorted.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-3">
                  <div className="w-24 text-sm text-muted-foreground">{e.date}</div>
                  <div className="flex-1">
                    <div className="font-medium">{e.source}</div>
                    {e.note && <div className="text-sm text-muted-foreground">{e.note}</div>}
                  </div>
                  <div className="font-display text-lg font-semibold text-primary">{money(e.amount, profile.currency)}</div>
                  <Button variant="ghost" size="icon" aria-label="Delete entry" onClick={() => setEntries(entries.filter((x) => x.id !== e.id))}><Trash2 /></Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <p className="pb-8 text-center text-xs text-muted-foreground">Your records stay private on this device.</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-primary-foreground/10 p-3"><div className="text-xs opacity-80">{label}</div><div className="font-display text-xl font-bold">{value}</div></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1 text-sm font-medium"><span>{label}</span>{children}</label>;
}
