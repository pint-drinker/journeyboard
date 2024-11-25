import { createBrowserRouter } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { SignIn } from "./components/SignIn";
import { NavBar } from "./components/NavBar";
import { ProcessMapsList } from "./processMaps/ProcessMapsList";
import { ProcessMapDetails } from "./processMaps/ProcessMapDetails";
import { InsightsList } from "./insights/InsightsList";


const ProtectedRoute = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const location = useLocation();

  if (isLoading) {
    return <Center><Spinner size="xl"/></Center>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};


// TODO: add error handling particularly with authentication on the backend
//  Send them back to the login page most likely
const router = createBrowserRouter([
  {
    path: "login",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <NavBar />,
    children: [
      {
        path: "",
        element: <Navigate to="process-maps" replace />,
      },
      {
        path: "process-maps",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <ProcessMapsList />,
          },
          {
            path: ":id", 
            element: <ProcessMapDetails />,
          }
        ]
      },
      {
        path: "insights",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <InsightsList />,
          }
        ]
      }
    ]
  }
]);

export default router;
