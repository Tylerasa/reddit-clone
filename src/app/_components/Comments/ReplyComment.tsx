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
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

type Reply =
  RouterOutputs["post"]["getComments"][number]["comment"]["replies"][number];

export const ReplyComment = (props: Reply) => {
  const { replies: subReplies, author, ...reply } = props;

  const hasVoted = reply!.votes.find(
    (vote: { authorId: any }) => vote.authorId === author!.id,
  );

  const [showReplyForm, setShowReplyForm] = useState(false);

  const [replyState, setReplyState] = useState(reply);
  const [optHasVoted, setOptHasVoted] = useState<number | null>(
    hasVoted?.value ?? null,
  );

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

  const handleVote = (value: number) => {
    let newReply = { ...replyState };

    // Optimistically update UI
    if (optHasVoted === value) {
      if (value === 1) {
        newReply.numUpvotes -= 1;
        let existingVoteIndex = newReply.votes.findIndex(
          (v) => v.value === 1 && v.authorId === author!.id,
        );
        if (existingVoteIndex !== -1) {
          newReply.votes.splice(existingVoteIndex, 1);
        }
      } else {
        newReply.numDownvotes -= 1;
        let existingVoteIndex = newReply.votes.findIndex(
          (v) => v.value === -1 && v.authorId === author!.id,
        );
        if (existingVoteIndex !== -1) {
          newReply.votes.splice(existingVoteIndex, 1);
        }
      }
      setOptHasVoted(null);
    } else {
      if (value === 1) {
        let existingVoteIndex = newReply.votes.findIndex(
          (v) => v.value === -1 && v.authorId === author!.id,
        );
        if (existingVoteIndex !== -1) {
          newReply.numDownvotes -= 1;
          newReply.votes.splice(existingVoteIndex, 1);
        }

        newReply.numUpvotes += 1;
        newReply.votes.push({
          id: Math.random(),
          commentId: Math.random(),
          postId: Math.random(),
          authorId: author!.id,
          value: 1,
        });
      } else {
        let existingVoteIndex = newReply.votes.findIndex(
          (v) => v.value === 1 && v.authorId === author!.id,
        );
        if (existingVoteIndex !== -1) {
          newReply.numUpvotes -= 1;
          newReply.votes.splice(existingVoteIndex, 1);
        }
        newReply.numDownvotes += 1;
        newReply.votes.push({
          id: Math.random(),
          commentId: Math.random(),
          postId: Math.random(),
          authorId: author!.id,
          value: -1,
        });
      }
      setOptHasVoted(value);
    }

    setReplyState(newReply);

    if (hasVoted?.value === value) {
      // Remove vote
      if (value === 1) {
        return removeUpVoteComment.mutate({ commentId: reply!.id });
      } else {
        return removeDownVoteComment.mutate({ commentId: reply!.id });
      }
    } else {
      // Add vote
      if (value === 1) {
        return addUpVoteComment.mutate({ commentId: reply!.id });
      } else {
        return addDownVoteComment.mutate({ commentId: reply!.id });
      }
    }
  };

  return (
    <div className="pl-[32px] pt-4">
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
              {dayjs(replyState.createdAt).fromNow()}
            </p>
          </div>

          <p className="text-sm leading-[20px] text-gray-800">{replyState.text}</p>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <ChevronUp
              onClick={() => handleVote(1)}
              className={`: cursor-pointer hover:stroke-indigo-600
          ${optHasVoted === 1 ? "stroke-indigo-600 " : "stroke-gray-700"}
          `}
            />
            <span className="font-medium text-gray-800">
              {replyState.numUpvotes - replyState.numDownvotes}
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
            commentId={reply.id}
            postId={reply.postId}
            imageUrl={author!.imageUrl ?? person}
            username={author!.username ?? ""}
          />
        </div>
      ) : null}
      {/* {subReplies.length > 0
        ? subReplies.map((r) => <ReplyComment {...r} />)
        : null} */}
    </div>
  );
};
