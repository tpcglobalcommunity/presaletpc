import React, { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useReferralNetwork } from "@/hooks/useReferralNetwork";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ReferralNetworkTable = () => {
  const { profile } = useAuth();
  const { data: referrals, isLoading } = useReferralNetwork(profile?.member_code || "");
  
  // State untuk Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  // Logika Filtering (Client-side agar cepat)
  const filteredData = useMemo(() => {
    if (!referrals) return [];
    
    return referrals.filter((member: {
      id: string;
      email: string;
      referral_code: string;
      created_at: string;
      status: string;
      level: number;
      email_current: string;
      member_code: string;
      referred_by: string;
    }) => {
      const matchesSearch = 
        member.email_current?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.member_code?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = levelFilter === "all" || member.level.toString() === levelFilter;
      
      return matchesSearch && matchesLevel;
    });
  }, [referrals, searchQuery, levelFilter]);

  if (isLoading) return <div className="p-4 text-center">Memuat jaringan...</div>;

  return (
    <div className="space-y-4">
      {/* Baris Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <Input 
          placeholder="Cari email atau kode member..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/2"
        />
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Semua Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Level</SelectItem>
            {[...Array(10)].map((_, i) => (
              <SelectItem key={i+1} value={(i+1).toString()}>Level {i+1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabel */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Kode Member</TableHead>
              <TableHead className="hidden md:table-cell">Diajak Oleh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((member: any, index: number) => (
              <TableRow key={index}>
                <TableCell><Badge variant="secondary">Lvl {member.level}</Badge></TableCell>
                <TableCell className="max-w-[150px] truncate">{member.email_current}</TableCell>
                <TableCell className="font-mono text-xs">{member.member_code}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                  {member.referred_by}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">Data tidak ditemukan.</div>
        )}
      </div>
    </div>
  );
};
