"use client";
import { useState } from "react";

import { Search } from "lucide-react";

import { Input } from "../../components/input";

interface SearchFilterProps {
  placeholder?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}

export function SearchFilter({ placeholder = "Search...", onSearchChange, className }: SearchFilterProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        className="no-focus-outline rounded-full border-0 bg-white px-5 pl-10 text-slate-500 shadow-sm placeholder:text-sm placeholder:text-slate-500"
      />
    </div>
  );
}

