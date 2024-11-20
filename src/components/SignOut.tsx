import React from "react";
import { Button } from "@chakra-ui/react";
import { useAuthActions } from "@convex-dev/auth/react";

export const SignOut = () => {
  const { signOut } = useAuthActions();
  
  return (
    <Button variant="ghost" onClick={() => void signOut()}>
      Sign Out
    </Button>
  );
};
