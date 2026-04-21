import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { Download, MessageCircle, Search } from "lucide-react";
import Seo from "@/components/Seo";

type LeadStatus = "new" | "contacted" | "in_progress" | "delivered" | "closed";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  service_type: string;
  status: LeadStatus;
  admin_notes: string | null;
  created_at: string;
  [k: string]: any;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string; cls: string }[] = [
  { value: "new", label: "New", cls: "bg-primary/10 text-primary" },
  { value: "contacted", label: "Contacted", cls: "bg-blue-100 text-blue-700" },
  { value: "in_progress", label: "In Progress", cls: "bg-amber-100 text-amber-700" },
  { value: "delivered", label: "Delivered", cls: "bg-green-100 text-green-700" },
  { value: "closed", label: "Closed", cls: "bg-muted text-muted-foreground" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load leads", description: error.message, variant: "destructive" });
    } else {
      setLeads((data ?? []) as Lead[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const services = useMemo(
    () => Array.from(new Set(leads.map((l) => l.service_type))).sort(),
    [leads]
  );

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (serviceFilter !== "all" && l.service_type !== serviceFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!l.name.toLowerCase().includes(s) && !l.phone.includes(s)) return false;
      }
      return true;
    });
  }, [leads, search, statusFilter, serviceFilter]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (selected?.id === id) setSelected({ ...selected, status });
    toast({ title: "Status updated" });
  };

  const saveNotes = async () => {
    if (!selected) return;
    const { error } = await supabase
      .from("leads")
      .update({ admin_notes: notes })
      .eq("id", selected.id);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((prev) =>
      prev.map((l) => (l.id === selected.id ? { ...l, admin_notes: notes } : l))
    );
    setSelected({ ...selected, admin_notes: notes });
    toast({ title: "Notes saved" });
  };

  const openDetail = (l: Lead) => {
    setSelected(l);
    setNotes(l.admin_notes ?? "");
  };

  const whatsappLink = (phone: string, name: string) => {
    const clean = phone.replace(/\D/g, "");
    const msg = encodeURIComponent(`Namaste ${name}, BhumiSeva se baat kar rahe hain.`);
    return `https://wa.me/91${clean.slice(-10)}?text=${msg}`;
  };

  const exportCsv = () => {
    if (!filtered.length) {
      toast({ title: "No data to export" });
      return;
    }
    const cols = ["created_at", "name", "phone", "email", "city", "service_type", "status", "admin_notes"];
    const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [cols.join(",")].concat(
      filtered.map((l) => cols.map((c) => escape((l as any)[c])).join(","))
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bhumiseva-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (s: LeadStatus) => {
    const opt = STATUS_OPTIONS.find((o) => o.value === s);
    return <Badge className={opt?.cls ?? ""} variant="secondary">{opt?.label ?? s}</Badge>;
  };

  return (
    <div className="space-y-4">
      <Seo title="Leads | BhumiSeva Admin" description="Manage customer leads" />
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Leads ({filtered.length})</h1>
        <Button onClick={exportCsv} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger><SelectValue placeholder="Service" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No leads found</TableCell></TableRow>
                ) : (
                  filtered.map((l) => (
                    <TableRow key={l.id} className="cursor-pointer" onClick={() => openDetail(l)}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(l.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{l.name}</TableCell>
                      <TableCell>{l.phone}</TableCell>
                      <TableCell>{l.service_type}</TableCell>
                      <TableCell>{l.city}</TableCell>
                      <TableCell>{statusBadge(l.status)}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button asChild size="sm" variant="ghost">
                          <a href={whatsappLink(l.phone, l.name)} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>{selected.service_type} • {selected.city}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 mt-6">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v as LeadStatus)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Phone:</span> {selected.phone}</div>
                  <div><span className="text-muted-foreground">Email:</span> {selected.email ?? "—"}</div>
                  <div><span className="text-muted-foreground">District:</span> {selected.district ?? "—"}</div>
                  <div><span className="text-muted-foreground">State:</span> {selected.state ?? "—"}</div>
                  <div><span className="text-muted-foreground">Khesra/Plot:</span> {selected.khesra_plot_no ?? "—"}</div>
                  <div><span className="text-muted-foreground">Khatiyan #:</span> {selected.khatiyan_number ?? "—"}</div>
                  <div><span className="text-muted-foreground">Mouza:</span> {selected.mouza ?? "—"}</div>
                  <div><span className="text-muted-foreground">Thana:</span> {selected.thana ?? "—"}</div>
                  <div><span className="text-muted-foreground">Block:</span> {selected.block ?? "—"}</div>
                  <div><span className="text-muted-foreground">Area:</span> {selected.area_mohalla ?? "—"}</div>
                </div>

                {selected.message && (
                  <div>
                    <p className="text-sm font-medium mb-1">Customer message</p>
                    <p className="text-sm bg-muted/50 rounded p-3">{selected.message}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Internal notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="mt-1"
                    placeholder="Add private notes about this lead…"
                  />
                  <Button size="sm" className="mt-2" onClick={saveNotes}>Save notes</Button>
                </div>

                <Button asChild className="w-full" variant="outline">
                  <a href={whatsappLink(selected.phone, selected.name)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" /> Open WhatsApp Chat
                  </a>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
