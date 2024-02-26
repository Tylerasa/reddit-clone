"use client";
import React from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { CommentPost, CommentPostSkeleton } from "../Posts/CommentPost";
import { RouterOutputs } from "~/trpc/shared";

type Comment = RouterOutputs["post"]["getComments"];

function CommentFeed() {
  const params = useParams<{ username: string; id: string; title: string }>();
  const id = Number(params.id);
  const { data, isLoading } = api.post.getComments.useQuery({
    postId: id,
  });

  const comments = data as Comment;

  return (
    <>
      {!isLoading && comments ? (
        <div className="">
          {comments
            .filter((c) => !c.comment.parentId)
            .map((comment) => (
              <CommentPost {...comment} />
            ))}
        </div>
      ) : (
        <div className="mt-[-24px]">
          {Array.from({ length: 3 }).map((_, i) => (
            <CommentPostSkeleton key={i} />
          ))}
        </div>
      )}
    </>
  );
}

export default CommentFeed;
