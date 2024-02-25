import React from "react";
import { api } from "~/trpc/server";
import {
  SingleFeedPost,
  SkeletonSingleFeedPost,
} from "../Posts/SingleFeedPost";

async function Feed() {
    
    const posts = await api.post.getAll.query();
    console.log("posts", posts);

  return (
    <>
      {posts  ? (
        <div className="">
          {posts.map((post) => (
            <SingleFeedPost {...post} key={post.post.id} />
          ))}
        </div>
      ) : (
        <div className="">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonSingleFeedPost key={i}/>
          ))}
        </div>
      )}
    </>
  );
}

export default Feed;
