"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectRoutesProps {
  children: React.ReactNode;
}

export default function ProtectRoutes({ children }: ProtectRoutesProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div
            className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return <>{children}</>;
}
