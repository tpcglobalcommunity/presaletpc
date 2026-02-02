import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReferralTabsHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  levelFilter: string;
  onLevelFilterChange: (value: string) => void;
}

export function ReferralTabsHeader({
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  levelFilter,
  onLevelFilterChange
}: ReferralTabsHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-[#0B0F14]/90 backdrop-blur-md border-b border-[#1F2A33] -mx-4 px-4 py-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start bg-[#11161C] border border-[#1F2A33] rounded-xl h-12">
          <TabsTrigger 
            value="tree" 
            className="data-[state=active]:bg-[#F0B90B]/10 data-[state=active]:text-[#F0B90B] data-[state=active]:border-[#F0B90B]/30 text-[#848E9C] hover:text-white"
          >
            Tree
          </TabsTrigger>
          <TabsTrigger 
            value="level" 
            className="data-[state=active]:bg-[#F0B90B]/10 data-[state=active]:text-[#F0B90B] data-[state=active]:border-[#F0B90B]/30 text-[#848E9C] hover:text-white"
          >
            Per Level
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="data-[state=active]:bg-[#F0B90B]/10 data-[state=active]:text-[#F0B90B] data-[state=active]:border-[#F0B90B]/30 text-[#848E9C] hover:text-white"
          >
            Aktivitas
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
          <Input
            placeholder="Cari email/kode..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-[#11161C] border-[#1F2A33] text-white placeholder-[#848E9C] focus:border-[#F0B90B]/50"
          />
        </div>
        
        <Select value={levelFilter} onValueChange={onLevelFilterChange}>
          <SelectTrigger className="w-full sm:w-40 bg-[#11161C] border-[#1F2A33] text-white">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#848E9C]" />
              <SelectValue placeholder="Level" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#11161C] border-[#1F2A33]">
            <SelectItem value="all">Semua Level</SelectItem>
            <SelectItem value="1">Level 1</SelectItem>
            <SelectItem value="2">Level 2</SelectItem>
            <SelectItem value="3">Level 3</SelectItem>
            <SelectItem value="4">Level 4</SelectItem>
            <SelectItem value="5">Level 5</SelectItem>
            <SelectItem value="6">Level 6</SelectItem>
            <SelectItem value="7">Level 7</SelectItem>
            <SelectItem value="8">Level 8</SelectItem>
            <SelectItem value="9">Level 9</SelectItem>
            <SelectItem value="10">Level 10</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
