'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import NoteModal from './NoteModal';

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NotesGridProps {
  initialNotes: Note[];
  token: string;
}

export default function NotesGrid({ initialNotes, token }: NotesGridProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  // Sync notes state with initialNotes when it changes
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prev) => prev.map((n) => (n._id === updatedNote._id ? updatedNote : n)));
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
      {notes.length > 0 ? (
        notes.map((note) => (
          <GridItem key={note._id}>
            <NoteModal
              note={note}
              token={token}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
            />
          </GridItem>
        ))
      ) : (
        <Box>No notes found.</Box>
      )}
    </Grid>
  );
}