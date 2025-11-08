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

// Stream
const CreateStream = lazy(() => import("./pages/streams/create"));
const LiveStream = lazy(() => import("./pages/streams/live"));
const VodStream = lazy(() => import("./pages/streams/index"));
const BrowseStreams = lazy(() => import("./pages/browse"));
const Following = lazy(() => import("./pages/following"));

// User
const UserProfile = lazy(() => import("./pages/user/profile"));
const UserProfileUpdate = lazy(() => import("./pages/user/update"));


const routes: RouteConfig[] = [
  {
    path: "/",
    page: Home,
    layout: DashboardLayout,
  },

  // Auth
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

  // Stream
  {
    path: "/streams/:id/create",
    page: CreateStream,
    layout: DashboardLayout,
  },
  {
    path: "/streams/:id/live",
    page: LiveStream,
    layout: DashboardLayout,
  },
    {
    path: "/streams/:id",
    page: VodStream,
    layout: DashboardLayout,
  },

  // Browse Livstreams
  {
    path: "/browse",
    page: BrowseStreams,
    layout: DashboardLayout,
  },

  // Following
  {
    path: "/following",
    page: Following,
    layout: DashboardLayout,
  },

  // User
  {
    path: "/user/:id/profile",
    page: UserProfile,
    layout: DashboardLayout,
  },
    {
    path: "/user/:id/update",
    page: UserProfileUpdate,
    layout: DashboardLayout,
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
