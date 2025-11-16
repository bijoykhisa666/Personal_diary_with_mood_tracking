import { Box } from "@chakra-ui/react";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import AddDiary from "./components/AddDiary";
import { getAuthCookies } from "./utils/auth";
import NotesGrid from "./components/NoteGrids";
import { SignupModal } from "./components/SignupModal";

interface Note {
  _id: string;
  title: string;
  content: string;
}

async function fetchNotes(id: string, token: string): Promise<Note[]> {
  if (!id || !token) return [];

  const res = await fetch(
    `https://personal-diary-ok2z.onrender.com/api/diary/user/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch notes", await res.text());
    return [];
  }

  return res.json();
}

export default async function Home() {
  const { id, token } = getAuthCookies();
  const notes = token ? await fetchNotes(id, token) : [];

  return (
    <>
      <TopBar token={token} />

      {/* Sidebar visible only on md+ screens */}
      <Box display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box ml={{ base: 0, md: "250px" }} p={6} bg="gray.50" minH="100vh">
        <Box mb={6}>
          <AddDiary />
        </Box>
        <NotesGrid initialNotes={notes} token={token} />
      </Box>

      {!token && <SignupModal />}
    </>
  );
}
