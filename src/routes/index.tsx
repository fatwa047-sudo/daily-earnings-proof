import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hero from "@/assets/hero-market.jpg";
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
      <header className="relative overflow-hidden text-primary-foreground">
        <img src={hero} alt="A boda rider and a market trader at a busy market" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-8">
          <nav className="flex items-center justify-between">
            <span className="font-display text-2xl font-extrabold">Work<span className="text-accent">Proof</span></span>
            <span className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs tracking-widest">SDG 8 · SDG 10</span>
          </nav>
          <h1 className="mt-16 max-w-2xl font-display text-5xl font-extrabold leading-[1.05] md:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">Your hustle is <em className="text-accent not-italic">real work.</em></h1>
          <p className="mt-5 max-w-lg text-lg opacity-90">No payslip? Log what you earn each day and print a one-page income statement for loans, rent or visas.</p>
        </div>
      </header>
      <div className="relative mx-auto -mt-16 grid max-w-6xl grid-cols-3 gap-3 px-5">
        <Stat label="Last 30 days" value={money(s30.total, profile.currency)} />
        <Stat label="Days worked" value={String(s30.days)} />
        <Stat label="Avg / work day" value={money(s30.avgPerWorkDay, profile.currency)} />
      </div>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <form onSubmit={add} className="rounded-2xl border bg-card p-6 shadow-card space-y-3">
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

          <div className="rounded-2xl border bg-card p-6 shadow-card space-y-3">
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

        <section className="rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="font-display text-2xl font-semibold">Earnings log</h2>
          {sorted.length === 0 ? (
            <p className="mt-6 rounded-lg bg-muted p-6 text-center text-muted-foreground">No entries yet. Add your first day's earnings — every day you log makes your record stronger.</p>
          ) : (
            <ul className="mt-4 divide-y">
              {sorted.map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted">
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
  return <div className="rounded-2xl border-t-4 border-accent bg-card p-5 shadow-card"><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-1 font-display text-2xl font-bold text-primary md:text-3xl">{value}</div></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1 text-sm font-medium"><span>{label}</span>{children}</label>;
}
