/** @format */

"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,

} from "@chakra-ui/react";
import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation"; // 🔥
import { signUpUser } from "../actions/signUpUser";
import Link from "next/link";

export default function SignupPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // 🔥

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await signUpUser(formData);

      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        status: result.success ? "success" : "error",
        duration: 5000,
        isClosable: true,
      });

      if (result.success && formRef.current) {
        formRef.current.reset();
        router.push("/login"); // 🔥 client redirect
      }
    });
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={12}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading mb={6} textAlign="center">
        Sign Up
      </Heading>

      <form ref={formRef} action={(formData) => handleSubmit(formData)}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" placeholder="Your name" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" placeholder="you@example.com" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" placeholder="••••••••" />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isPending}
          >
            Create Account
          </Button>
        </VStack>
        <Box w="full" textAlign="center" mt={4}>
          <Text>
            Already have an account?{" "}
            <Link
              href="/login"
              color="teal.500"
            >
              Login
            </Link>
          </Text>
        </Box>
      </form>
    </Box>
  );
}
