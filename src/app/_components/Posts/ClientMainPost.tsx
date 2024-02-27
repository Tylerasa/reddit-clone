import { ChevronUp } from "assets/svgs/ChevronUp";
import Image from "next/image";
import React, { useState } from "react";
import person from "assets/images/person.png";
import { api } from "~/trpc/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChevronDown } from "assets/svgs/ChevronDown";
import ReplyPost from "./ReplyPost";
import { useRouter } from "next/navigation";
import { RouterOutputs } from "~/trpc/shared";

type PostWithUser = RouterOutputs["post"]["getAll"][number];

const ClientMainPost = (props: PostWithUser) => {
  const { post, author } = props;

  const hasVoted = post!.votes.find(
    (vote: { authorId: any }) => vote.authorId === author.id,
  );
  const [postState, setPostState] = useState(post);
  const [optHasVoted, setOptHasVoted] = useState<number | null>(hasVoted?.value?? null);

  const router = useRouter();

  const addUpVote = api.post.addUpVote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const removeUpVote = api.post.removeUpVote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const addDownVote = api.post.addDownVote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const removeDownVote = api.post.removeDownVote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleVote = (value: number) => {
    let newPost = { ...postState };

    // Optimistically update UI
    if (optHasVoted === value) {
      if (value === 1) {
        newPost.numUpvotes -= 1;
        let existingVoteIndex = newPost.votes.findIndex(
          (v) => v.value === 1 && v.authorId === author.id,
        );
        if (existingVoteIndex !== -1) {
          newPost.votes.splice(existingVoteIndex, 1);
        }
      } else {
        newPost.numDownvotes -= 1;
        let existingVoteIndex = newPost.votes.findIndex(
          (v) => v.value === -1 && v.authorId === author.id,
        );
        if (existingVoteIndex !== -1) {
          newPost.votes.splice(existingVoteIndex, 1);
        }
      }
      setOptHasVoted(null);
    } else {
      if (value === 1) {
        let existingVoteIndex = newPost.votes.findIndex(
          (v) => v.value === -1 && v.authorId === author.id,
        );
        if (existingVoteIndex !== -1) {
          newPost.numDownvotes -= 1;
          newPost.votes.splice(existingVoteIndex, 1);
        }

        newPost.numUpvotes += 1;
        newPost.votes.push({
          id: Math.random(),
          commentId: Math.random(),
          postId: Math.random(),
          authorId: author.id,
          value: 1,
        });
      } else {
        let existingVoteIndex = newPost.votes.findIndex(
          (v) => v.value === 1 && v.authorId === author.id,
        );
        if (existingVoteIndex !== -1) {
          newPost.numUpvotes -= 1;
          newPost.votes.splice(existingVoteIndex, 1);
        }
        newPost.numDownvotes += 1;
        newPost.votes.push({
          id: Math.random(),
          commentId: Math.random(),
          postId: Math.random(),
          authorId: author.id,
          value: -1,
        });
      }
      setOptHasVoted(value);
    }

    setPostState(newPost);

    if (hasVoted?.value === value) {
      // Remove vote
      if (value === 1) {
        return removeUpVote.mutate({ postId: post!.id });
      } else {
        return removeDownVote.mutate({ postId: post!.id });
      }
    } else {
      // Add vote
      if (value === 1) {
        return addUpVote.mutate({ postId: post!.id });
      } else {
        return addDownVote.mutate({ postId: post!.id });
      }
    }
  };

  

  return (
    <div className="border-b border-b-gray-200 pb-6">
      <div className="flex w-full gap-4  py-10">
        <div className="">
          <div className="flex flex-col items-center gap-[10px] ">
            <ChevronUp
              onClick={() => handleVote(1)}
              className={`h-5 w-5 cursor-pointer hover:stroke-indigo-600
           ${optHasVoted === 1 ? "stroke-indigo-600 " : "stroke-gray-700"}
          `}
            />
            <span className="font-medium text-gray-800">
              {postState ? postState.numUpvotes - postState.numDownvotes : "0"}
            </span>
            <ChevronDown
              onClick={() => handleVote(-1)}
              className={`h-5 w-5 cursor-pointer hover:stroke-indigo-600
              ${optHasVoted === -1 ? "stroke-indigo-600 " : "stroke-gray-700"}
             `}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center gap-[6px]">
            {author && author.imageUrl ? (
              <Image
                src={author.imageUrl}
                alt={`picture of ${author.username}`}
                className="h-6 w-6 rounded-full"
                width={24}
                height={24}
              />
            ) : (
              <Image
                src={person}
                alt="picture of an person"
                className="h-6 w-6"
                width={24}
                height={24}
              />
            )}
            <p className="text-sm  text-gray-600">
              Posted by <span className="lowercase">{author?.username}</span>{" "}
              {dayjs(postState?.createdAt).fromNow()}
            </p>
          </div>

          <p className="font-medium ">{postState?.title}</p>
          <p className="text-sm leading-[20px]">{postState?.content}</p>
        </div>
      </div>
      <ReplyPost
        postId={postState.id}
        imageUrl={author.imageUrl}
        username={author.username}
      />
    </div>
  );
};

export default ClientMainPost;
