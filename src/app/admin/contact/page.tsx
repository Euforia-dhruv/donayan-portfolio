"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate, truncate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function ContactPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const supabase = createClient();

  const fetchData = async () => {
    let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [search]);

  const markRead = async (id: string) => {
    const { error } = await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    if (!error) fetchData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Message deleted"); fetchData(); if (selected?.id === id) setSelected(null); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Contact form submissions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
                ) : items.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No messages</TableCell></TableRow>
                ) : items.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`cursor-pointer ${!item.read ? "font-semibold" : ""}`}
                    onClick={() => { setSelected(item); if (!item.read) markRead(item.id); }}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-xs">{item.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{truncate(item.message, 60)}</TableCell>
                    <TableCell>
                      {item.read
                        ? <span className="text-xs text-muted-foreground">Read</span>
                        : <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">New</span>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(item.created_at)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); remove(item.id); }}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selected && (
          <Card>
            <CardHeader>
              <CardTitle>{selected.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{selected.email}</p>
              <p className="text-xs text-muted-foreground">{formatDate(selected.created_at)}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{selected.message}</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <a href={`mailto:${selected.email}`}><Mail className="mr-2 h-4 w-4" />Reply</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
