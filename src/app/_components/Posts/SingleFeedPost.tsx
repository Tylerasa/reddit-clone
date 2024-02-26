"use client";
import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import Image from "next/image";
import person from "assets/images/person.png";
import { RouterOutputs } from "~/trpc/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toSnakeCase } from "~/helpers/snake-case";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];

export const SingleFeedPost = (props: PostWithUser) => {
  const { author, post } = props;

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

  const hasVoted = post.votes.find((vote) => vote.authorId === author.id);

  const handleVote = (value: number) => {

    if (hasVoted?.value === value) {
      // Remove vote
      if (value === 1) {
        return removeUpVote.mutate({ postId: post.id });
      } else {
        return removeDownVote.mutate({ postId: post.id });
      }
    } else {
      // Add vote
      if (value === 1) {
        return addUpVote.mutate({ postId: post.id });
      } else {
        return addDownVote.mutate({ postId: post.id });
      }
    }
  };

  return (
    <div className="flex w-full gap-4 border-b border-b-gray-200 py-10">
      <div className="">
        <div className="flex flex-col items-center gap-[10px] ">
          <ChevronUp
            onClick={() => handleVote(1)}
            className={`: cursor-pointer hover:stroke-indigo-600
          ${hasVoted?.value === 1 ? "stroke-indigo-600 " : "stroke-gray-700"}
          `}
          />

          <span className="font-medium text-gray-800">
            {post.numUpvotes - post.numDownvotes}
          </span>
          <ChevronDown
            onClick={() => handleVote(-1)}
            className={`: cursor-pointer hover:stroke-indigo-600
            ${hasVoted?.value === -1 ? "stroke-indigo-600 " : "stroke-gray-700"}
            `}
          />
        </div>
      </div>
      <Link
        href={`/r/${author.username}/comments/${post.id}/${toSnakeCase(post.title)}`}
        className="flex w-full cursor-pointer flex-col gap-[6px]"
      >
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
            Posted by <span className="lowercase">{author?.username}</span> {dayjs(post.createdAt).fromNow()}
          </p>
        </div>

        <p className="font-medium ">{post.title}</p>
        <p className="text-sm leading-[20px]">{post.content}</p>
      </Link>
    </div>
  );
};

export const SkeletonSingleFeedPost = () => {
  return (
    <div className="flex w-full gap-4 border-b border-b-gray-200 py-10">
      <div className="">
        <div className="flex flex-col items-center gap-[10px] ">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-6 w-7" />

          <Skeleton className="h-4 w-4" />
        </div>
      </div>
      <div className="flex w-full flex-col gap-[6px]">
        <div className="flex items-center gap-[6px]">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-[211px]" />
        </div>

        <Skeleton className="h-5 w-[322px] " />
        <div className="">
          <Skeleton className="h-4 w-full " />
          <Skeleton className="my-1 h-4 w-full " />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    </div>
  );
};
