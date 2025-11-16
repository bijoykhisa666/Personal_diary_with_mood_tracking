/** @format */
// LoginForm.tsx

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
  Link,
  Text
} from "@chakra-ui/react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { loginUser } from "../actions/loginUser";
import TopBar from "../components/TopBar";

export default function LoginForm() {
  const toast = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);

    startTransition(async () => {
      const result = await loginUser(formData);

      if (result.success) {
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/");
      } else {
        toast({
          title: "Login failed",
          description: result.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <Box>
      <TopBar />
      <Box maxW="md" mx="auto" mt={12} p={6} borderWidth={1} borderRadius="lg">
        <Heading mb={6}>Login</Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
              />
            </FormControl>

            <Box w="full" textAlign="right">
              <Link href="/forgot-password">
                <Button variant="link" size="sm" colorScheme="yellow">
                  Forgot Password?
                </Button>
              </Link>
            </Box>

            <Button
              type="submit"
              colorScheme="teal"
              isDisabled={isPending}
              w="full"
            >
              {isPending ? <Spinner size="sm" /> : "Login"}
            </Button>
          </VStack>
        </form>

        <Box w="full" textAlign="center" mt={4}>
          <Text>
            Don't have an account?{" "}
            <Link href="/signup" color="teal.500" fontWeight="bold">
              Sign Up
            </Link>
          </Text>
        </Box>

        {/* Google Login */}
        <Button
          mt={4}
          onClick={handleGoogleLogin}
          leftIcon={<FcGoogle />}
          variant="outline"
          size="lg"
          width="full"
        >
          Login with Google
        </Button>
      </Box>
    </Box>
  );
}
