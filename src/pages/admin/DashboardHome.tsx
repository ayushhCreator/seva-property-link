import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Users, TrendingUp, Inbox, CheckCircle } from "lucide-react";
import Seo from "@/components/Seo";

const STATUS_COLORS: Record<string, string> = {
  new: "hsl(var(--primary))",
  contacted: "hsl(217 91% 60%)",
  in_progress: "hsl(38 92% 50%)",
  delivered: "hsl(142 71% 45%)",
  closed: "hsl(0 0% 60%)",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In Progress",
  delivered: "Delivered",
  closed: "Closed",
};

export default function DashboardHome() {
  const [stats, setStats] = useState({ today: 0, total: 0, delivered: 0, inProgress: 0 });
  const [byService, setByService] = useState<{ name: string; count: number }[]>([]);
  const [byStatus, setByStatus] = useState<{ name: string; value: number; key: string }[]>([]);

  useEffect(() => {
    (async () => {
      const { data: leads } = await supabase
        .from("leads")
        .select("service_type, status, created_at");
      if (!leads) return;
      const todayStr = new Date().toISOString().slice(0, 10);
      const today = leads.filter((l) => (l.created_at as string).slice(0, 10) === todayStr).length;
      const delivered = leads.filter((l) => l.status === "delivered").length;
      const inProgress = leads.filter((l) => l.status === "in_progress").length;
      setStats({ today, total: leads.length, delivered, inProgress });

      const svc: Record<string, number> = {};
      const stat: Record<string, number> = {};
      for (const l of leads) {
        svc[l.service_type] = (svc[l.service_type] ?? 0) + 1;
        stat[l.status] = (stat[l.status] ?? 0) + 1;
      }
      setByService(Object.entries(svc).map(([name, count]) => ({ name, count })));
      setByStatus(
        Object.entries(stat).map(([k, v]) => ({ key: k, name: STATUS_LABELS[k] ?? k, value: v }))
      );
    })();
  }, []);

  const cards = [
    { label: "Today's Leads", value: stats.today, icon: Inbox, color: "text-primary" },
    { label: "Total Leads", value: stats.total, icon: Users, color: "text-blue-600" },
    { label: "In Progress", value: stats.inProgress, icon: TrendingUp, color: "text-amber-600" },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <Seo title="Admin Dashboard | BhumiSeva" description="BhumiSeva admin overview" />
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className="text-3xl font-bold mt-1">{c.value}</p>
                </div>
                <c.icon className={`h-8 w-8 ${c.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Leads by Service</CardTitle></CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byService}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Leads by Status</CardTitle></CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={100} label>
                  {byStatus.map((s) => (
                    <Cell key={s.key} fill={STATUS_COLORS[s.key] ?? "hsl(var(--muted))"} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
