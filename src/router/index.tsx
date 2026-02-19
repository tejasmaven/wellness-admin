import { createBrowserRouter } from "react-router-dom";
import Login from "../auth/Login";
import RequireAuth from "../auth/RequireAuth";
import Layout from "../layout/Layout";

import Dashboard from "../pages/Dashboard";
import Admins from "../pages/Admins";
import Permissions from "../pages/Permissions";
import Role from "../pages/Role";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/dashboard", element: <Dashboard /> },
         { path: "/admins", element: <Admins /> },
         { path: "/roles", element: <Role /> },
         { path: "/permissions", element: <Permissions /> }
        ]
      }
    ]
  }
]);
