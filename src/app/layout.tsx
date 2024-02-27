import "~/styles/globals.css";
import "~/styles/app.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import { ClerkProvider } from "@clerk/nextjs";
import SideNav from "./_components/Shared/SideNav";
import { Toaster } from "~/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Reddit Clone",
  description: "Reddit Clone for Senior Fullstack developer task",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`font-sans ${inter.variable} flex h-screen w-screen bg-white`}
        >
          <SideNav />
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster
            expand={true}
            position="top-center"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
