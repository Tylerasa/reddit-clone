import "~/styles/globals.css";
import "~/styles/app.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { Home } from "assets/svgs/Home";
import { Login } from "assets/svgs/Login";
import Image from "next/image";
import person from "assets/images/person.png";
import { ClerkProvider, SignInButton, SignOutButton } from "@clerk/nextjs";
import CheckAuthStatusNav from "./_components/CheckAuthStatusNav";

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
          <aside className="flex h-screen w-[17.313rem] flex-col overflow-y-auto border-r border-r-gray-200 p-4 font-medium text-gray-700">
            <div className="flex flex-1 flex-col gap-1">
              <Link
                href={"/"}
                className="hov-but  flex w-full items-center gap-4 rounded-xl px-4 py-3 hover:bg-gray-50"
              >
                <Home stroke="#4B5563" className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <CheckAuthStatusNav />
            </div>
            <SignOutButton />
            <div className="flex items-center gap-4 px-3 py-4">
              <Image
                src={person}
                alt="picture of an person"
                className="h-8 w-8"
              />
              <span>Christine Cook</span>
            </div>
          </aside>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
