import type { FC, PropsWithChildren } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Suspense, Fragment, lazy } from "react";
import ErrorBoundary from "./components/shared/error-boundary";
import AuthLayout from "./components/layouts/auth-layout";
import { Toaster } from "./components/ui/sonner";
import DashboardLayout from "./components/layouts/dashboard-layout";

interface RouteConfig {
  path: string;
  page: FC;
  layout?: FC<PropsWithChildren>;
  guard?: FC<PropsWithChildren>;
}

const Home = lazy(() => import("./pages/home"));

// Auth
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password"));
const VerifyOTP = lazy(() => import("./pages/auth/verify-otp"));

const routes: RouteConfig[] = [
  {
    path: "/",
    page: Home,
    layout: DashboardLayout,
  },
  {
    path: "/auth/login",
    page: Login,
    layout: AuthLayout,
  },
  {
    path: "/auth/signup",
    page: Signup,
    layout: AuthLayout,
  },
  {
    path: "/auth/forgot-password",
    page: ForgotPassword,
    layout: AuthLayout,
  },
  {
    path: "/auth/reset-password",
    page: ResetPassword,
    layout: AuthLayout,
  },
  {
    path: "/auth/verify-otp",
    page: VerifyOTP,
    layout: AuthLayout,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorBoundary />,
    children: routes.map(
      ({
        path,
        page: Page,
        layout: Layout = Fragment,
        guard: Guard = Fragment,
      }) => ({
        path,
        element: (
          <Suspense>
            <Layout>
              <Guard>
                <Page />
                <Toaster
                  closeButton
                  position="bottom-right"
                  style={{ backgroundColor: "#1E1E1E" }}
                />
              </Guard>
            </Layout>
          </Suspense>
        ),
      })
    ),
  },
]);
