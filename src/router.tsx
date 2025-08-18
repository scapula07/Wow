import type { FC, PropsWithChildren } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Suspense, Fragment, lazy } from "react";
import ErrorBoundary from "./components/shared/error-boundary";

interface RouteConfig {
  path: string;
  page: FC;
  layout?: FC<PropsWithChildren>;
  guard?: FC<PropsWithChildren>;
}

const Home = lazy(() => import("./pages/home"));

const routes: RouteConfig[] = [
  {
    path: "/",
    page: Home,
  },
];

export const router = createBrowserRouter(
  routes.map(
    ({
      path,
      page: Page,
      layout: Layout = Fragment,
      guard: Guard = Fragment,
    }) => ({
      path,
      element: (
        <Suspense>
          <ErrorBoundary>
            <Layout>
              <Guard>
                <Page />
              </Guard>
            </Layout>
          </ErrorBoundary>
        </Suspense>
      ),
    })
  )
);
