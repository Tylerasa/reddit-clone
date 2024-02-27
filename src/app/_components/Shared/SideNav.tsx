"use client";
import React from "react";
import Link from "next/link";
import { Home } from "assets/svgs/Home";
import Image from "next/image";

import { SignOutButton, useUser } from "@clerk/nextjs";
import CheckAuthStatusNav from "../CheckAuthStatusNav";
import { Login } from "assets/svgs/Login";
import { usePathname } from "next/navigation";

const SideNav = () => {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[17.313rem] flex-col overflow-y-auto border-r border-r-gray-200 p-4 font-medium text-gray-700">
      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={"/"}
          className={`hov-but  flex w-full items-center gap-4 rounded-xl ${pathname !== "/my-posts" ? "bg-gray-50 " : ""} px-4 py-3 text-indigo-500 hover:bg-gray-50`}
        >
          <Home className="h-5 w-5 stroke-indigo-600" />
          <span>Home</span>
        </Link>
        <CheckAuthStatusNav />
      </div>
      <div className="">
        {user && user.hasImage ? (
          <div className="">
            <SignOutButton>
              <div className="hov-but  flex w-full cursor-pointer items-center gap-4 rounded-xl bg-gray-50 px-4  py-3 hover:bg-gray-50 ">
                <Login className="h-5 w-5 rotate-180 stroke-gray-600 hover:stroke-indigo-600 " />
                <span>Sign Out</span>
              </div>
            </SignOutButton>
            <div className="flex items-center gap-4 px-4 py-3">
              <>
                <Image
                  src={user.imageUrl}
                  alt={`picture of ${user.firstName}`}
                  className="h-8 w-8 rounded-full"
                  width={32}
                  height={32}
                />
                <div className="overflow-hidden">
                  <p className="word-clip">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default SideNav;
