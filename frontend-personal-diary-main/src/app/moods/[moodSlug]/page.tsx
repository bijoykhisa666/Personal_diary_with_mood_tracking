// app/moods/[moodSlug]/page.tsx
import { getAuthCookies } from "@/app/utils/auth"; // your auth helper
import NotesGrid from "@/app/components/NoteGrids";
import AddDiary from "@/app/components/AddDiary";
import { Box } from "@chakra-ui/react";
import TopBar from "@/app/components/TopBar";
import Sidebar from "@/app/components/Sidebar";
import { SignupModal } from "@/app/components/SignupModal";

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface MoodPageProps {
  params: { moodSlug: string };
}

async function fetchMoodNotes(userId: string, token: string, mood: string): Promise<Note[]> {
  if (!userId || !token) return [];

  const res = await fetch(
    `https://personal-diary-ok2z.onrender.com/api/diary/user/${userId}/mood/${mood}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // always fetch fresh data
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch mood notes", await res.text());
    return [];
  }

  return res.json();
}

export default async function MoodPage({ params }: MoodPageProps) {
  const { moodSlug } = params;
  const { id, token } = getAuthCookies(); // get user id and token from cookies

  const notes = token && id ? await fetchMoodNotes(id, token, moodSlug) : [];

  return (
    <>
      <TopBar />

      {/* Sidebar visible only on md+ screens */}
      <Box display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box ml={{ base: 0, md: "250px" }} p={6} bg="gray.50" minH="100vh">
        {/* <Box mb={6}>
          <AddDiary />
        </Box> */}
        <NotesGrid initialNotes={notes} token={token} />
      </Box>

      {!token && <SignupModal />}
    </>
  );
}
