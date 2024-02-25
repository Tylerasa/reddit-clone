import React from "react";
import { api } from "~/trpc/server";
import { SingleFeedPost } from "../Posts/SingleFeedPost";

async function Feed() {
  const posts = await api.post.getAll.query();

  return (
    <>
      {posts.map((post) => (
        <SingleFeedPost {...post} key={post.post.id} />
      ))}
    </>
  );
}

export default Feed;
