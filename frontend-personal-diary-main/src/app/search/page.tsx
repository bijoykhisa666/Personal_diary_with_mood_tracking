/** @format */

import { Box, Heading, VStack } from "@chakra-ui/react";
import TopBar from "../components/TopBar";
import NotesGrid from "../components/NoteGrids";
import { cookies } from "next/headers"; // server-side cookie access
import Sidebar from "../components/Sidebar";
import SearchInput from "../components/SearchInput";

interface SearchPageProps {
  searchParams: { q?: string };
}

// Server-side fetch function
const fetchSearchResults = async (token: string, query: string) => {
    try {
      const url = `https://personal-diary-ok2z.onrender.com/api/diary/search?q=${encodeURIComponent(query)}`;
      
  
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store", // always fetch fresh data
      });
  
      if (!res.ok) {
        return [];
      }
  
      const data = await res.json();
      return data.entries || [];
    } catch (err) {
      console.error("Search fetch error:", err);
      return [];
    }
  };
  

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Get token from server-side cookies
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";


  // Fetch search results only if query exists
  let results: any[] = [];
  if (token && searchParams.q) {
    results = await fetchSearchResults(token, searchParams.q);
  }

  return (
    <Box>
      <TopBar token={token} />

      {/* Sidebar visible only on md+ screens */}
      <Box display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box ml={{ base: 0, md: "250px" }} p={6} bg="gray.50" minH="100vh">
        <VStack spacing={4} align="start" mb={4}>
          <Heading size="md">Search Your Diaries</Heading>
          {/* Client component for interactive search */}
          {/* <SearchInput initialValue={searchParams.q || ""} /> */}
        </VStack>

        <NotesGrid initialNotes={results} token={token} />
      </Box>
    </Box>
  );
}
