/** @format */

"use client";

import { Input } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  initialValue?: string;
}

export default function SearchInput({ initialValue = "" }: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  // Update query when typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Update the URL without reloading
    const newUrl = value ? `/search?q=${encodeURIComponent(value)}` : "/search";
    window.history.replaceState({}, "", newUrl);
  };

  // Optional: trigger search when URL changes (client-side navigation)
  useEffect(() => {
    // Could be used to trigger fetch on input change if needed
  }, [query]);

  return (
    <Input
      placeholder="Type to search..."
      value={query}
      onChange={handleChange}
      size="lg"
      variant="filled"
    />
  );
}
