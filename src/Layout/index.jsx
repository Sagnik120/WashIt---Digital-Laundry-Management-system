import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const PrivateLayout = dynamic(() => import("./PrivateLayout.tsx"), {
  ssr: false,
});

const ProtectedRoute = dynamic(() => import("@/routes/ProtectedRoute"), {
  ssr: false,
});

const Layout = ({ children }) => {
  const pathname = usePathname();
  const privateRoutes = ["/userProfile"];
  const publicRoutes = [
    "/auth/login",
    "/home",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/change-password",
    "/",
  ];
  if (!pathname) return null;

  if (privateRoutes.includes(pathname)) {
    return (
      <PrivateLayout>{children}</PrivateLayout>
      // <ProtectedRoute>
      //   <PrivateLayout>{children}</PrivateLayout>
      // </ProtectedRoute>
    );
  } else if (publicRoutes.includes(pathname)) {
    return children;
  }
};

export default Layout;
