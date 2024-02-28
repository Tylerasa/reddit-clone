"use client";
import React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Login } from "assets/svgs/Login";
import { MyPosts } from "assets/svgs/MyPosts";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CheckAuthStatusNav = () => {
  const user = useUser();

  const pathname = usePathname();

  return (
    <>
      {!user.isSignedIn ? (
        <div className="cursor-pointer">
          <SignInButton>
            <div className="hov-but  flex w-full items-center gap-4 rounded-xl px-4 py-3 hover:bg-gray-50">
              <Login stroke="#4B5563" className="h-5 w-5 " />
              <span>Log in</span>
            </div>
          </SignInButton>
        </div>
      ) : (
        <Link
          href={"/my-posts"}
          className={`hov-but ${pathname === "/my-posts" ? "bg-gray-50 " : ""}  flex w-full items-center gap-4 rounded-xl px-4 py-3 hover:bg-gray-50`}
        >
          <MyPosts
            className={`h-5 w-5 ${pathname === "/my-posts" ? "stroke-indigo-600" : "stroke-[#4B5563]"}`}
          />
          <span
            className={`${pathname === "/my-posts" ? "text-indigo-500 " : ""} `}
          >
            My Posts
          </span>
        </Link>
      )}
    </>
  );
};

export default CheckAuthStatusNav;
