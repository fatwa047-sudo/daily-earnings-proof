import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEntries, useProfile, summarize, money, today, daysAgo } from "@/lib/workproof";

export const Route = createFileRoute("/statement")({
  head: () => ({
    meta: [
      { title: "Income Statement — WorkProof" },
      { name: "description", content: "A one-page income statement built from your daily earnings log." },
      { property: "og:title", content: "Income Statement — WorkProof" },
      { property: "og:description", content: "Printable proof of income for informal workers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Statement,
});

function Statement() {
  const [entries] = useEntries();
  const [p] = useProfile();
  const [from, setFrom] = useState(daysAgo(89));
  const [to, setTo] = useState(today());
  const s = summarize(entries, from, to);
  const ref = `WP-${(p.name || "X").slice(0, 2).toUpperCase()}-${to.replace(/-/g, "")}-${s.inRange.length}`;

  return (
    <div className="min-h-screen py-6">
      <div className="no-print mx-auto mb-4 flex max-w-3xl flex-wrap items-end gap-3 px-5">
        <Button asChild variant="ghost"><Link to="/"><ArrowLeft /> Back</Link></Button>
        <label className="text-sm">From<Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="text-sm">To<Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <Button onClick={() => window.print()} className="ml-auto"><Printer /> Download / Print PDF</Button>
      </div>

      <article className="print-sheet mx-auto max-w-3xl rounded-xl border bg-card p-10 shadow-card">
        <div className="flex items-start justify-between border-b-4 border-primary pb-4">
          <div>
            <div className="font-display text-3xl font-extrabold text-primary">WorkProof</div>
            <div className="text-sm text-muted-foreground">Statement of Self-Reported Income</div>
          </div>
          <div className="text-right text-sm"><div>Ref: {ref}</div><div>Issued: {today()}</div></div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <Row k="Name" v={p.name || "—"} /><Row k="Occupation" v={p.work || "—"} />
          <Row k="Location" v={p.location || "—"} /><Row k="Phone" v={p.phone || "—"} />
          <Row k="Period" v={`${from} to ${to}`} /><Row k="Records" v={`${s.inRange.length} entries`} />
        </dl>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Box k="Total income" v={money(s.total, p.currency)} />
          <Box k="Est. monthly income" v={money(s.avgMonthly, p.currency)} />
          <Box k="Days worked" v={String(s.days)} />
        </div>

        <h3 className="mt-8 font-display text-lg font-semibold">Monthly breakdown</h3>
        <table className="mt-2 w-full text-sm">
          <thead><tr className="border-b text-left text-muted-foreground"><th className="py-2">Month</th><th className="py-2 text-right">Income</th></tr></thead>
          <tbody>
            {s.months.length === 0 && <tr><td colSpan={2} className="py-3 text-muted-foreground">No earnings logged in this period.</td></tr>}
            {s.months.map(([m, v]) => (
              <tr key={m} className="border-b"><td className="py-2">{new Date(m + "-01").toLocaleString("en", { month: "long", year: "numeric" })}</td><td className="py-2 text-right font-medium">{money(v, p.currency)}</td></tr>
            ))}
          </tbody>
          <tfoot><tr><td className="py-2 font-semibold">Total</td><td className="py-2 text-right font-semibold">{money(s.total, p.currency)}</td></tr></tfoot>
        </table>

        <p className="mt-8 text-xs text-muted-foreground">This statement summarises daily earnings recorded by the holder in WorkProof. Figures are self-reported; the recipient may request supporting evidence such as mobile money statements.</p>
        <div className="mt-10 grid grid-cols-2 gap-8 text-sm">
          <div className="border-t pt-2">Signature of holder</div>
          <div className="border-t pt-2">Date</div>
        </div>
      </article>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b border-dashed py-1"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>;
}
function Box({ k, v }: { k: string; v: string }) {
  return <div className="rounded-lg bg-secondary p-4"><div className="text-xs text-muted-foreground">{k}</div><div className="font-display text-xl font-bold">{v}</div></div>;
}
