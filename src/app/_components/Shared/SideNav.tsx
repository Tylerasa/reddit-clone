"use client";
import React from "react";
import Link from "next/link";
import { Home } from "assets/svgs/Home";
import Image from "next/image";
import person from "assets/images/person.png";

import { SignOutButton, useUser } from "@clerk/nextjs";
import CheckAuthStatusNav from "../CheckAuthStatusNav";

const SideNav = () => {
  const { user } = useUser();
  console.log("user", user);

  return (
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
      <div className="flex items-center gap-4 px-4 py-3">
        {user && user.hasImage ? (
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
        ) : (
          <>
            <Image
              src={person}
              alt="picture of an person"
              className="h-8 w-8"
              width={32}
              height={32}
            />
            <span>Christine Cook</span>
          </>
        )}
      </div>
    </aside>
  );
};

export default SideNav;
