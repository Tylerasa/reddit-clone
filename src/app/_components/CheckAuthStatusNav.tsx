"use client";
import React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Login } from "assets/svgs/Login";
import { MyPosts } from "assets/svgs/MyPosts";
import Link from "next/link";

const CheckAuthStatusNav = () => {
  const user = useUser();
  console.log("user", user);
  
  return (
    <>
      {!user.isSignedIn ? (
        <div className="cursor-pointer">
          <SignInButton>
            <div className="hov-but  flex w-full items-center gap-4 rounded-xl px-4 py-3 hover:bg-gray-50">
              <Login stroke="#4B5563" />
              <span>Log in</span>
            </div>
          </SignInButton>
        </div>
      ) : (
        <Link
          href={"/"}
          className="hov-but  flex w-full items-center gap-4 rounded-xl px-4 py-3 hover:bg-gray-50"
        >
          <MyPosts stroke="#4B5563" className="h-5 w-5" />
          <span>My Posts</span>
        </Link>
      )}
    </>
  );
};

export default CheckAuthStatusNav;
