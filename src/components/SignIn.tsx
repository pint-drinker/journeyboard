import { Box, Button, Center, Stack, Heading, Text, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setError("");
    try {
      await signIn("password", { 
        email, 
        password, 
        flow: isSignUp ? "signUp" : "signIn",
      });
      // add a manual redirect to /process-maps since redirectTo is not working great
      // TODO: figure out why redirectTo is not working and also do it for signup
      // TODO: figure out how to make sure the adding to group members thing works
      // add a slight delay here
      if (isSignUp) {
        setTimeout(() => {
          navigate("/process-maps");
        }, 300);
      } else {
        navigate("/process-maps");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setError("Failed to sign in. Please check your credentials and try again.");
    }
    setIsSigningIn(false);
  };

  return (
    <Center minH="100vh" bg="gray.50" width="100vw">
      <Box p={8} maxW="md" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
        <Stack spacing={6} align="center">
          <Heading size="xl">Welcome</Heading>
          <Text fontSize="lg" color="gray.600">
            {isSignUp ? "Sign up for" : "Sign in to"} JourneyBoard
          </Text>

          <FormControl as="form" onSubmit={handleSubmit} width="100%">
            <Stack spacing={3} width="100%">
              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isSigningIn}
              >
                {isSignUp ? "Sign up" : "Sign in"} with Email
              </Button>
            </Stack>
          </FormControl>

          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </Button>

          <Text color="gray.500">or</Text>

          <Button
            leftIcon={<FaGithub />}
            size="lg"
            width="100%"
            colorScheme="gray"
            onClick={() => void signIn("github", { redirectTo: "/process-maps" })}
          >
            Sign in with GitHub
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};
