import { Box, Flex, Text, Button, Link as RouterLink, Menu, MenuList, MenuItem, MenuButton, MenuDivider } from "@chakra-ui/react";
import {
  Link,
  Outlet,
} from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

// TODO: enhance this to highlight current page
export const NavBar = () => {
  const group = useQuery(api.auth.currentGroup);
  const user = useQuery(api.auth.currentUser);
  const { signOut } = useAuthActions();
  return (
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
          <Menu>
            <MenuButton as={Button} variant="ghost">
              <Flex align="center">
                <Box textAlign="right">
                  <Text fontSize="sm" fontWeight="bold">{group?.name || "Group Name"}</Text>
                  <Text fontSize="xs">{user?.email || "user@example.com"}</Text>
                </Box>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem>
                Edit Group
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => void signOut()}>
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
    <Box mx="auto" p={4}>
      <Outlet />
    </Box>
    </>
  );
};
