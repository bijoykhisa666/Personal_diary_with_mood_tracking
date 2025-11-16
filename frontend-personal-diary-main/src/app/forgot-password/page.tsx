"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState, useTransition } from "react";
import { forgotPassword } from "../actions/forgotPassword";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);

    startTransition(async () => {
      const result = await forgotPassword(formData);

      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        status: result.success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Forgot Password</Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" isDisabled={isPending} w="full">
            {isPending ? <Spinner size="sm" /> : "Send Reset Link"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
