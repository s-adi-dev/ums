import { CenterWrapper } from "@/components/custom ui/center-page";
import { Loader } from "@/components/custom ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";
import { ProtectedRoute } from "@/utils/Protected Route";
import React, { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

// Pages
const Dashboard = lazy(() => import("@/pages/panel/dashboard"));
const UserDetails = lazy(() => import("@/pages/panel/user-details/index"));
const UserList = lazy(() => import("@/pages/panel/users"));
const Task = lazy(() => import("@/pages/panel/task"));
const Reports = lazy(() => import("@/pages/panel/reports"));
const Settings = lazy(() => import("@/pages/panel/settings"));
const Role = lazy(() => import("@/pages/panel/settings/role"));
const Audit = lazy(() => import("@/pages/panel/settings/audit"));

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  currContent: string;
  setPage: (page: string) => void;
}

interface RouteMapping {
  path: string;
  element: JSX.Element;
  pageName: string;
}

const MainBody: React.FC<MainProps> = ({
  currContent,
  setPage,
  className,
  ...props
}) => {
  const Maintainance = () => <h1>{currContent}</h1>;

  // Hooks
  const currPath = useLocation();
  const { combinedRole } = useAuth(false);

  const hasPageAccess = combinedRole?.permissions.map((page) => page.page);

  const FirstPage = hasPageAccess ? hasPageAccess[0] : "";

  const getFirstPageElement = (pageName: string) => {
    switch (pageName) {
      case "Dashboard":
        return <Dashboard />;
      case "Users":
        return <UserList />;
      case "Task":
        return <Task />;
      case "Reports":
        return <Reports />;
      case "Settings":
        return <Settings />;
      default:
        return <h1>No Access</h1>;
    }
  };

  const componentMapping: RouteMapping[] = [
    { path: "/", element: getFirstPageElement(FirstPage), pageName: FirstPage },
    { path: "dashboard", element: <Dashboard />, pageName: "Dashboard" },
    { path: "analytics", element: <Maintainance />, pageName: "Analytics" },
    { path: "users/", element: <UserList />, pageName: "Users" },
    { path: "users/details/:id", element: <UserDetails />, pageName: "Users" },
    { path: "task", element: <Task />, pageName: "Task" },
    { path: "reports", element: <Reports />, pageName: "Reports" },
    { path: "settings", element: <Settings />, pageName: "Settings" },
    {
      path: "settings/roles",
      element: <Role />,
      pageName: "Settings",
    },
    {
      path: "settings/audit",
      element: <Audit />,
      pageName: "Settings",
    },
    {
      path: "*",
      element: <CenterWrapper>404 | Page not found</CenterWrapper>,
      pageName: "Not Found",
    },
  ];

  // Utility Function
  const findMatchingPage = (
    currPath: string | undefined,
  ): string | undefined => {
    if (!currPath) return undefined;

    const matchedRoute = componentMapping.find((route) => {
      const pathParts = route.path.split("/")[0];
      const currParts = currPath.split("/")[2];

      if (currParts === pathParts) return route;
    });

    return matchedRoute?.pageName;
  };

  // useEffects
  useEffect(() => {
    const matchedKey = findMatchingPage(currPath.pathname);
    if (matchedKey) {
      setPage(matchedKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPath]);

  const filteredRoutes = componentMapping.filter(
    (route) =>
      hasPageAccess?.includes(route.pageName) || route.pageName === "Not Found",
  );

  return (
    <ScrollArea className={cn("w-full", className)}>
      <main
        id="main-content"
        className="w-full h-full p-4 flex justify-center items-start"
        {...props}
      >
        <Suspense
          fallback={
            <CenterWrapper>
              <Loader />
            </CenterWrapper>
          }
        >
          <Routes>
            {filteredRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              />
            ))}
          </Routes>
        </Suspense>
      </main>
    </ScrollArea>
  );
};

export { MainBody };
