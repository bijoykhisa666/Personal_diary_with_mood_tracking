import { Box, Text } from "@chakra-ui/react";

interface NoteCardProps {
  title: string;
  content: string;
}

export default function NoteCard({ title, content }: NoteCardProps) {
  return (
    <Box
      p={4}
      bg="white"
      rounded="md"
      shadow="sm"
      border="1px solid #e2e8f0"
      _hover={{ shadow: "md" }}
    >
      <Text fontWeight="bold" mb={2}>
        {title}
      </Text>
      <Text>{content}</Text>
    </Box>
  );
}
