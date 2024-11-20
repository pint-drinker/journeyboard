import React from "react";
import { Box, Flex, Text, Button, Link as RouterLink } from "@chakra-ui/react";
import {
  Link,
  Outlet,
} from "react-router-dom";
import { SignOut } from "./SignOut";

// TODO: enhance this to highlight current page
export const NavBar = () => (
  <>
    <Box position="fixed" top={0} width="100%" bg="white" boxShadow="sm" zIndex={1}>
      <Flex p={4} align="center">
        <Text fontSize="xl" fontWeight="bold" mr={8}>JourneyBoard</Text>
        <Link as={RouterLink} to="/process-maps" mr={4}>
          <Button variant="ghost">Process Maps</Button>
        </Link>
        <Link as={RouterLink} to="/insights">
          <Button variant="ghost">Insights</Button>
        </Link>
        <Box ml="auto">
          <SignOut />
        </Box>
      </Flex>
    </Box>
    <Box mx="auto" p={4}>
      <Outlet />
    </Box>
  </>
);
