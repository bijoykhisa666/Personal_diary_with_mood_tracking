/** @format */
// app/page.tsx  (or app/Notification.tsx)

import { Box, SimpleGrid, Text, Heading } from "@chakra-ui/react";

import { format } from "date-fns";
import { getAuthCookies } from "../utils/auth";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import AddDiary from "../components/AddDiary";
import NoteLinkCardClient from "../components/NoteModalClient";
import { SignupModal } from "../components/SignupModal";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
}

/* --------------------------------------------------------------- */
/* 1. Fetch notes (Server Component – no hooks!)                  */
/* --------------------------------------------------------------- */
async function fetchNotes(userId: string, token: string): Promise<Note[]> {
  if (!userId || !token) return [];

  const res = await fetch(
    `https://personal-diary-ok2z.onrender.com/api/diary/user/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) return [];
  return res.json();
}

/* --------------------------------------------------------------- */
/* 2. Server Page Component                                        */
/* --------------------------------------------------------------- */
export default async function NotificationPage() {
  const { id, token } = getAuthCookies();
  const notes = token ? await fetchNotes(id, token) : [];

  return (
    <>
      <TopBar token={token} />

      <Box display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>

      <Box
        ml={{ base: 0, md: "250px" }}
        p={{ base: 4, md: 6 }}
        bg="gray.50"
        minH="100vh"
      >

        {/* <Heading as="h2" size="lg" mb={6} textAlign="center" color="gray.700">
          My Diary
        </Heading> */}

        {notes.length === 0 ? (
          <Text textAlign="center" color="gray.500" fontSize="lg">
            {token ? "No notes yet. Start writing!" : "Log in to see your notes."}
          </Text>
        ) : (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={5}
            justifyItems="center"
          >
            {notes.map((note) => (
              <NoteLinkCardClient key={note._id} note={note} token={token} />
            ))}
          </SimpleGrid>
        )}
      </Box>

      {!token && <SignupModal />}
    </>
  );
}