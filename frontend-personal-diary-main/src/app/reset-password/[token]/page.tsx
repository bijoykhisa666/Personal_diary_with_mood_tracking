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
import { useRouter, useParams } from "next/navigation";
import { resetPassword } from "../../actions/resetPassword";

export default function ResetPasswordPage() {
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("password", password);

    startTransition(async () => {
      const result = await resetPassword(formData, token);

      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        status: result.success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });

      if (result.success) {
        router.push("/login");
      }
    });
  };

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Reset Password</Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="password" isRequired>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" isDisabled={isPending} w="full">
            {isPending ? <Spinner size="sm" /> : "Reset Password"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
