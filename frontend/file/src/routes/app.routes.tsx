import { lazy } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { ProtectedRoute } from "./protected.routes";
import ProtectedLayout from "../components/layouts/protected-layout/protected.layout";

const LoginPage = lazy(() => import("../pages/login.page"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const PatientProfile = lazy(() => import("../pages/patient.profile"));
const AddPatient = lazy(() => import("../pages/add.patient"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/dashboard",
            children: [
              { index: true, element: <AddPatient /> },
              { path: "records", element: <Dashboard /> },
              { path: "patient/:id", element: <PatientProfile /> },
              { path: "add-patient", element: <AddPatient /> },
            ],
          },
        ],
      },
    ],
  },
];

interface AppRouter extends ReturnType<typeof createBrowserRouter> {}
export const router: AppRouter = createBrowserRouter(routes);
