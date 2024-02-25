"use client";
import React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Login } from "assets/svgs/Login";
import { MyPosts } from "assets/svgs/MyPosts";
import Link from "next/link";
import { CreatePost } from "./Posts/CreatePost";

const CheckAuthStatusFeed = () => {
  const user = useUser();
  return (
    <>
      {user.isSignedIn ? (
        <div className="pt-10">
          <CreatePost />
        </div>
      ) : null}
    </>
  );
};

export default CheckAuthStatusFeed;
