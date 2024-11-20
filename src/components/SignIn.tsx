import { Box, Button, Center, Stack, Heading, Text } from "@chakra-ui/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { FaGithub } from "react-icons/fa";
 
export const SignIn = () => {
  const { signIn } = useAuthActions();
  return (
    <Center minH="100vh" bg="gray.50" width="100vw">
      <Box p={8} maxW="md" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
        <Stack spacing={6} align="center">
          <Heading size="xl">Welcome</Heading>
          <Text fontSize="lg" color="gray.600">
            Sign in to access JourneyBoard
          </Text>
          <Button
            leftIcon={<FaGithub />}
            size="lg"
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
