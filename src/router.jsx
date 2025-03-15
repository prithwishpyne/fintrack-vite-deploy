import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import React, { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const Home = React.lazy(() => import("./components/home/Home"));
const Auth = React.lazy(() => import("./components/auth/Auth"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <CircularProgress />
          </div>
        }
      >
        <App />
      </Suspense>
    ),
    children: [
      {
        path: "/home",
        element: (
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100vh",
                }}
              >
                <CircularProgress />
              </div>
            }
          >
            <Home />
          </Suspense>
        ),
      },
      {
        path: "auth",
        element: (
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100vh",
                }}
              >
                <CircularProgress />
              </div>
            }
          >
            <Auth />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
