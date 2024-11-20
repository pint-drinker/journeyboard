import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ConvexReactClient } from "convex/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import router from "./router";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const theme = extendTheme({});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </QueryClientProvider>
    </ConvexAuthProvider>
  </React.StrictMode>,
);
