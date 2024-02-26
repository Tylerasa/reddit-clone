"use client";
import person from "assets/images/person.png";
import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import { Reply } from "assets/svgs/Reply";
import Image from "next/image";
import { useRef, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { RouterOutputs } from "~/trpc/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReplyPost from "../Posts/ReplyPost";

dayjs.extend(relativeTime);

type Reply =
  RouterOutputs["post"]["getComments"][number]["comment"]["replies"][number];

export const ReplyComment = (props: Reply) => {
  const { replies: subReplies, author, ...reply } = props;

  console.log("props", props);

  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="py-4 pb-6 pl-[32px]">
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
              {dayjs(reply.createdAt).fromNow()}
            </p>
          </div>

          <p className="text-sm leading-[20px] text-gray-800">{reply.text}</p>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <ChevronUp className="cursor-pointer stroke-gray-700 hover:stroke-indigo-600" />
            <span className="font-medium text-gray-800">
              {reply.numUpvotes - reply.numDownvotes}
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
      {subReplies.length > 0
        ? subReplies.map((r) => <ReplyComment {...r} />)
        : null}
      {showReplyForm ? (
        <div className="mt-6">
          <ReplyPost
            commentId={reply.id}
            postId={reply.postId}
            imageUrl={author!.imageUrl ?? person}
            username={author!.username ?? ""}
          />
        </div>
      ) : null}
    </div>
  );
};
