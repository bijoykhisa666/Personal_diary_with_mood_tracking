/** @format */
"use client";

import { Box, Text } from "@chakra-ui/react";
import { format } from "date-fns";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
}

interface NoteLinkCardProps {
  note: Note;
  token: string;
}

export default function NoteLinkCardClient({ note, token }: NoteLinkCardProps) {

  return (
    <>
      <Box
        p={5}
        bg="white"
        rounded="xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.200"
        width="100%"
        maxW="300px"
        textAlign="center"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          shadow: "lg",
          transform: "translateY(-4px)",
          borderColor: "blue.300",
        }}
      >
        <Text
          fontWeight="semibold"
          fontSize="lg"
          color="gray.800"
          noOfLines={2}
          mb={2}
        >
          {note.title}
        </Text>

        {note.createdAt && (
          <Text fontSize="sm" color="gray.500">
            {format(new Date(note.createdAt), "MMM d, yyyy")}
          </Text>
        )}
      </Box>

    </>
  );
}