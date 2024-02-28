//load slower but handle updates for other users

"use client"
import React, { useEffect, useState } from "react";
// import { api } from "~/trpc/server";
import {
  SingleFeedPost,
  SkeletonSingleFeedPost,
} from "../Posts/SingleFeedPost";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

type PostWithUser = RouterOutputs["post"]["getAll"];

function Feed() {
  const { data, isLoading } = api.post.getAll.useQuery();
  const [posts, setPosts] = useState<PostWithUser>();

  useEffect(() => {
    setPosts(data);
  }, [data, isLoading]);
  return (
    <>
      {!isLoading && posts ? (
        <div className="">
          {posts &&
            posts.map((post) => <SingleFeedPost {...post} key={post.post.id} />)}
        </div>
      ) : (
        <div className="">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonSingleFeedPost key={i} />
          ))}
        </div>
      )}

      {!isLoading && data && data.length === 0 ? (
        <p className="pt-4 text-center text-sm text-gray-700 ">
          No posts yet...
        </p>
      ) : null}
    </>
  );
}

export default Feed;
