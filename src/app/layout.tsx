import { AuthProvider } from "@/context/AuthContext";
import { ActivityPoolProvider } from "@/context/ActivityPoolContext";
import { QueryProvider } from "@/providers/QueryProvider";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TripCraft",
  description: "Plan your perfect journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <ActivityPoolProvider>
              <Navbar />
              {children}
              <Toaster position="bottom-right" richColors />
            </ActivityPoolProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
