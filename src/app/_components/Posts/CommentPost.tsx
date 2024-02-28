"use client";
import person from "assets/images/person.png";
import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import { Reply } from "assets/svgs/Reply";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReplyPost from "./ReplyPost";
import { Skeleton } from "~/components/ui/skeleton";
import { RouterOutputs } from "~/trpc/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReplyComment } from "../Comments/ReplyComment";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useUser } from "@clerk/nextjs";

dayjs.extend(relativeTime);

type Comment = RouterOutputs["post"]["getComments"][number];
type Reply =
  RouterOutputs["post"]["getComments"][number]["comment"]["replies"][number];
type Vote = RouterOutputs["post"]["getAll"][number]["post"]["votes"][number];
type User = RouterOutputs["post"]["getAll"][number]["author"];

export const CommentPost = (props: Comment) => {
  const { comment, author } = props;
  const clerkUser = useUser();

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [commentState, setCommentState] = useState(comment);
  const [optHasVoted, setOptHasVoted] = useState<Vote | undefined>(undefined);
  const [hasVoted, setHasVoted] = useState<Vote | undefined>(undefined);

  const [user, setUser] = useState<User | null>();

  const ref = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const addUpVoteComment = api.post.addUpVoteComment.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const removeUpVoteComment = api.post.removeUpVoteComment.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const addDownVoteComment = api.post.addDownVoteComment.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const removeDownVoteComment = api.post.removeDownVoteComment.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  useEffect(() => {
    if (clerkUser && clerkUser.user) {
      setHasVoted(
        comment.votes.find((vote) => vote.authorId === clerkUser.user.id),
      );

      setUser(user);
    }
  }, [clerkUser]);

  useEffect(() => {
    setCommentState(comment);
  }, [comment]);

  useEffect(() => {
    setOptHasVoted(hasVoted);
  }, [clerkUser, hasVoted]);

  const handleVote = (value: number) => {
    let newComment = { ...commentState };

    // Optimistically update UI
    if (optHasVoted?.value === value) {
      if (value === 1) {
        newComment.numUpvotes -= 1;
        let existingVoteIndex = newComment.votes.findIndex(
          (v) => v.value === 1 && v.authorId === author.id,
        );
        if (existingVoteIndex !== -1) {
          newComment.votes.splice(existingVoteIndex, 1);
        }
      } else {
        newComment.numDownvotes -= 1;
        let existingVoteIndex = newComment.votes.findIndex(
          (v) => v.value === -1 && v.authorId === author.id,
        );
        if (existingVoteIndex !== -1) {
          newComment.votes.splice(existingVoteIndex, 1);
        }
      }
      setOptHasVoted(undefined);
    } else {
      let newVote = {
        id: Math.random(),
        commentId: Math.random(),
        postId: Math.random(),
        authorId: clerkUser.user!.id,
        value,
      };
      if (value === 1) {
        let existingVoteIndex = newComment.votes.findIndex(
          (v) => v.value === -1 && v.authorId === clerkUser.user!.id,
        );
        if (existingVoteIndex !== -1) {
          if (newComment.numUpvotes - newComment.numDownvotes !== 0) {
            newComment.numDownvotes -= 1;
          }
          newComment.votes.splice(existingVoteIndex, 1);
        }

        newComment.numUpvotes += 1;
        newVote.value = value;

        newComment.votes.push(newVote);
      } else {
        let existingVoteIndex = newComment.votes.findIndex(
          (v) => v.value === 1 && v.authorId === clerkUser.user!.id,
        );
        if (existingVoteIndex !== -1) {
          if (newComment.numUpvotes - newComment.numDownvotes !== 0) {
            newComment.numUpvotes -= 1;
          }
          newComment.votes.splice(existingVoteIndex, 1);
        }
        newComment.numDownvotes += 1;
        newVote.value = value;
        newComment.votes.push(newVote);
      }
      setOptHasVoted(newVote);
    }

    setCommentState(newComment);

    if (hasVoted?.value === value) {
      // Remove vote
      if (value === 1) {
        return removeUpVoteComment.mutate({ commentId: comment!.id });
      } else {
        return removeDownVoteComment.mutate({ commentId: comment!.id });
      }
    } else {
      // Add vote
      if (value === 1) {
        return addUpVoteComment.mutate({ commentId: comment!.id });
      } else {
        return addDownVoteComment.mutate({ commentId: comment!.id });
      }
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);

    if (ref && ref.current) {
      ref.current.click();
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={`item-${comment.id}`} className="">
        <div className="pb-4">
          <div className="flex w-full gap-4 border-b pb-4">
            <div className="flex w-full flex-col gap-3">
              <AccordionTrigger ref={ref}></AccordionTrigger>
              <div className="flex flex-col gap-3">
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
                    Posted by{" "}
                    <span className="lowercase">{author?.username}</span>{" "}
                    {dayjs(commentState.createdAt).fromNow()}
                  </p>
                </div>

                <p className="text-left text-sm leading-[20px] text-gray-800">
                  {commentState.text}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <ChevronUp
                  onClick={() => handleVote(1)}
                  className={`cursor-pointer hover:stroke-indigo-600
                  ${optHasVoted?.value === 1 && optHasVoted.authorId === (clerkUser && clerkUser.user && clerkUser.user.id ? clerkUser.user.id : null) ? "stroke-indigo-600 " : "stroke-gray-700"}
                  `}
                />
                <span className="font-medium text-gray-800">
                  {commentState.numUpvotes - commentState.numDownvotes}
                </span>
                <ChevronDown
                  onClick={() => handleVote(-1)}
                  className={`cursor-pointer hover:stroke-indigo-600
                  ${optHasVoted?.value === -1 && optHasVoted.authorId === (clerkUser && clerkUser.user && clerkUser.user.id ? clerkUser.user.id : null) ? "stroke-indigo-600 " : "stroke-gray-700"}
                  `}
                />
                <div
                  onClick={handleReplyClick}
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
          <AccordionContent>
            {showReplyForm ? (
              <div className="mt-6">
                <ReplyPost
                  commentId={commentState.id}
                  postId={commentState.postId}
                  imageUrl={author.imageUrl}
                  username={author.username}
                />
              </div>
            ) : null}

            {commentState.replies.map((reply) => (
              <ReplyComment key={reply.id} {...reply} />
            ))}
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export const CommentPostSkeleton = () => {
  return (
    <div className="flex w-full gap-4 border-b border-b-gray-200 py-6">
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
