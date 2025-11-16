"use client";

import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box
      ml={{ base: 0, md: "250px" }}
      p={6}
      bg="gray.50"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4}>
        <Spinner size="xl" thickness="4px" speed="0.65s" color="yellow.500" />
        <Text fontSize="lg" color="gray.600">
          Loading your diary...
        </Text>
      </VStack>
    </Box>
  );
}
