import { Box, Center, Text, HStack, Link, Stack } from "@chakra-ui/react";

export function SignupModal() {
  return (
    <Center
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="rgba(0,0,0,0.6)"
      zIndex={1000}
    >
      <Box
        bg="white"
        p={8}
        rounded="md"
        maxW="400px"
        textAlign="center"
        boxShadow="lg"
      >
        <Text mb={6} fontSize="xl" fontWeight="bold">
          You must be signed in to continue
        </Text>

        <Stack justifyContent="center" spacing={4}>
          <Link href="/signup" color="blue.500" fontWeight="semibold" fontSize="md">
            Create a new account
          </Link>
          <Link href="/login" color="blue.500" fontWeight="semibold" fontSize="md">
            Existing user? Sign in
          </Link>
        </Stack>
      </Box>
    </Center>
  );
}
