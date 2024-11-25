import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Box, Heading, Stack, Skeleton, Button, Link as RouterLink, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { AddProcessMapModal } from "./AddProcessMapModal";

export const ProcessMapsList = () => {
  const processMaps = useQuery(api.processMaps.list);

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!processMaps) {
    return (
      <Box pt={20}>
        <Skeleton height="60px" mb={4} />
        <Skeleton height="60px" mb={4} />
        <Skeleton height="60px" />
      </Box>
    );
  }

  return (
    <>
    <AddProcessMapModal isOpen={isOpen} onClose={onClose} />
    <Box pt={20}>
      <Heading mb={6}>Process Maps</Heading>
      <Stack spacing={4} gap={1} mb={1}>
        {processMaps.map((map) => (
          // @ts-ignore
          <Link key={map._id} as={RouterLink} to={`/process-maps/${map._id}`}>
            <Button 
              width="100%" 
              p={4} 
              bg="white" 
              rounded="md" 
              shadow="sm"
              justifyContent="flex-start"
              _hover={{ bg: 'gray.50' }}
            >
              <Text>{map.name}</Text>
            </Button>
          </Link>
        ))}
      </Stack>
      <Button
        mb={6}
        colorScheme="blue"
        onClick={onOpen}
      >
        Add Process Map
      </Button>
    </Box>
    </>
  );
};
