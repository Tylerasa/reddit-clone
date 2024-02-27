import React from "react";
import { api } from "~/trpc/server";
import {
  SingleFeedPost,
  SkeletonSingleFeedPost,
} from "../Posts/SingleFeedPost";

async function MyFeed() {
  const posts = await api.post.getAllUserPosts.query();

  return (
    <>
      {posts ? (
        <div className="">
          {posts.map((post) => (
            <SingleFeedPost {...post} key={post.post.id} />
          ))}
        </div>
      ) : (
        <div className="">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonSingleFeedPost key={i} />
          ))}
        </div>
      )}

      {posts && posts.length === 0 ? (
        <p className="pt-4 text-center text-sm text-gray-700 ">
          No posts yet...
        </p>
      ) : null}
    </>
  );
}

export default MyFeed;
