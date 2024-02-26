"use client";
import React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Login } from "assets/svgs/Login";
import { MyPosts } from "assets/svgs/MyPosts";
import Link from "next/link";
import { CreatePost, CreatePostSkeleton } from "./Posts/CreatePost";

const CheckAuthStatusFeed = () => {
  const user = useUser();
  return (
    <>

      {user.isSignedIn && !user.user ? (
        <div className="pt-10">
          <CreatePostSkeleton />
        </div>
      ) : user.isSignedIn && user.user ? (
        <div className="pt-10">
          <CreatePost
            username={user.user.username ?? ""}
            imageUrl={user.user.imageUrl}
          />
        </div>
      ) : null}

      
    </>
  );
};

export default CheckAuthStatusFeed;
