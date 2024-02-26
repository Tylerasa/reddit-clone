import { ChevronUp } from "assets/svgs/ChevronUp";
import Image from "next/image";
import React from "react";
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

  const hasVoted = post!.votes.find(
    (vote: { authorId: any }) => vote.authorId === author.id,
  );

  return (
    <div className="border-b border-b-gray-200 pb-6">
      <div className="flex w-full gap-4  py-10">
        <div className="">
          <div className="flex flex-col items-center gap-[10px] ">
            <ChevronUp
              onClick={() => handleVote(1)}
              className={`h-5 w-5 cursor-pointer hover:stroke-indigo-600
           ${hasVoted?.value === 1 ? "stroke-indigo-600 " : "stroke-gray-700"}
          `}
            />
            <span className="font-medium text-gray-800">
              {post ? post.numUpvotes - post.numDownvotes : "0"}
            </span>
            <ChevronDown
              onClick={() => handleVote(1)}
              className={`h-5 w-5 cursor-pointer hover:stroke-indigo-600
              ${hasVoted?.value === -1 ? "stroke-indigo-600 " : "stroke-gray-700"}
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
              {dayjs(post?.createdAt).fromNow()}
            </p>
          </div>

          <p className="font-medium ">{post?.title}</p>
          <p className="text-sm leading-[20px]">{post?.content}</p>
        </div>
      </div>
      <ReplyPost postId={post.id}  imageUrl={author.imageUrl} username={author.username}/>
    </div>
  );
};

export default ClientMainPost;
