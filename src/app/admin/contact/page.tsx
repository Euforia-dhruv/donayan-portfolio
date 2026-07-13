"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function ContactPage() {
  const items = useQuery(api.contact.list, {}) ?? [];
  const markRead = useMutation(api.contact.markRead);
  const remove = useMutation(api.contact.remove);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => { if (items !== undefined) setLoading(false); }, [items]);

  const filtered = search
    ? items.filter(
        (m: any) =>
          m.name?.toLowerCase().includes(search.toLowerCase()) ||
          m.email?.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const handleMarkRead = async (id: Id<"contactMessages">) => {
    try {
      await markRead({ id });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const doRemove = async (id: Id<"contactMessages">) => {
    try {
      await remove({ id });
      toast.success("Message deleted");
      if (selected?._id === id) setSelected(null);
    } catch (err: any) {
      toast.error(err.message);
    }
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
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No messages</TableCell></TableRow>
                ) : filtered.map((item: any) => (
                  <TableRow
                    key={item._id}
                    className={`cursor-pointer ${item.status === "unread" ? "font-semibold" : ""}`}
                    onClick={() => { setSelected(item); if (item.status === "unread") handleMarkRead(item._id); }}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-xs">{item.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">{item.subject || "—"}</TableCell>
                    <TableCell>
                      {item.status === "read"
                        ? <span className="text-xs text-muted-foreground">Read</span>
                        : <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">New</span>}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); doRemove(item._id); }}><Trash2 className="h-4 w-4" /></Button>
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
              {selected.phone && <p className="text-xs text-muted-foreground">{selected.phone}</p>}
            </CardHeader>
            <CardContent>
              {selected.subject && (
                <p className="text-sm font-medium mb-2">{selected.subject}</p>
              )}
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
