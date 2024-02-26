"use client";
import person from "assets/images/person.png";
import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import { Reply } from "assets/svgs/Reply";
import Image from "next/image";
import { useRef, useState } from "react";
import ReplyPost from "./ReplyPost";
import { Skeleton } from "~/components/ui/skeleton";
import { RouterOutputs } from "~/trpc/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Comment = RouterOutputs["post"]["getComments"][number];

export const CommentPost = (props: Comment) => {
  const { comment, author } = props;

  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className=" pb-6">
      <div className="flex w-full gap-4">
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
              {dayjs(comment.createdAt).fromNow()}
            </p>
          </div>

          <p className="text-sm leading-[20px] text-gray-800">{comment.text}</p>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <ChevronUp className="cursor-pointer stroke-gray-700 hover:stroke-indigo-600" />
            <span className="font-medium text-gray-800">
              {comment.numUpvotes - comment.numDownvotes}
            </span>
            <ChevronDown className="cursor-pointer stroke-gray-700 hover:stroke-indigo-600" />
            <div
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="hov-but flex cursor-pointer items-center gap-2"
            >
              <Reply
                className={`cursor-pointer ${showReplyForm ? "stroke-indigo-600" : "stroke-gray-700"} hover:stroke-indigo-600`}
              />
              <span
                className={`${showReplyForm ? "text-indigo-600" : "text-gray-700"}`}
              >
                Reply
              </span>
            </div>
          </div>
        </div>
      </div>
      {showReplyForm ? (
        <div className="mt-6">
          <ReplyPost
            postId={comment.postId}
            imageUrl={author.imageUrl}
            username={author.username}
          />
        </div>
      ) : null}
    </div>
  );
};

export const CommentPostSkeleton = () => {
  return (
    <div className="flex w-full gap-4 border-b border-b-gray-200 py-6">
      {/* <div className="">
        <div className="flex flex-col items-center gap-[10px] ">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-6 w-7" />

          <Skeleton className="h-4 w-4" />
        </div>
      </div> */}
      <div className="flex w-full flex-col gap-[6px]">
        <div className="flex items-center gap-[6px]">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-[211px]" />
        </div>

        <div className="">
          <Skeleton className="h-4 w-full " />
          <Skeleton className="my-1 h-4 w-full " />
          <Skeleton className="h-4 w-[80%]" />
          <div className="mt-1 flex justify-start">
            <div className="flex  items-center gap-[10px] ">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-[14px]" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-[38px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
