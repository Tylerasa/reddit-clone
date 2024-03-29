//the server feed loads faster but, it does not handle update for other users
import React from "react";
import { api } from "~/trpc/server";
import {
  SingleFeedPost,
  SkeletonSingleFeedPost,
} from "../Posts/SingleFeedPost";

async function ServerFeed() {
  const posts = await api.post.getAll.query();

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

export default ServerFeed;
