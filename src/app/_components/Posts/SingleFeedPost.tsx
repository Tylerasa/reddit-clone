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
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];
type Vote = RouterOutputs["post"]["getAll"][number]["post"]["votes"][number];
type User = RouterOutputs["post"]["getAll"][number]["author"];

export const SingleFeedPost = (props: PostWithUser) => {
  const { author, post } = props;
  const clerkUser = useUser();


  const [postState, setPostState] = useState(post);
  const [hasVoted, setHasVoted] = useState<Vote | undefined>(undefined);
  const [optHasVoted, setOptHasVoted] = useState<Vote | undefined>(undefined);
  const [user, setUser] = useState<User | null>();

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

  useEffect(() => {
    if (clerkUser && clerkUser.user) {
      setHasVoted(
        post.votes.find((vote) => vote.authorId === clerkUser.user.id),
      );

      setUser(user);
    }
  }, [clerkUser]);

  useEffect(() => {
    setOptHasVoted(hasVoted);
  }, [clerkUser, hasVoted]);


  const handleVote = (value: number) => {
    if (!clerkUser.user || !clerkUser.isSignedIn) {
      toast("Sign in to upvote or down");
      return;
    }

    let newPost = { ...postState };

    // Optimistically update UI
    if (optHasVoted?.value === value) {
      if (value === 1) {
        newPost.numUpvotes -= 1;
        let existingVoteIndex = newPost.votes.findIndex(
          (v) => v.value === 1 && v.authorId === clerkUser.user.id,
        );
        if (existingVoteIndex !== -1) {
          newPost.votes.splice(existingVoteIndex, 1);
        }
      } else {
        newPost.numDownvotes -= 1;
        let existingVoteIndex = newPost.votes.findIndex(
          (v) => v.value === -1 && v.authorId === clerkUser.user.id,
        );
        if (existingVoteIndex !== -1) {
          newPost.votes.splice(existingVoteIndex, 1);
        }
      }
      setOptHasVoted(undefined);
    } else {
      let newVote = {
        id: Math.random(),
        commentId: Math.random(),
        postId: Math.random(),
        authorId: clerkUser.user.id,
        value,
      };
      if (value === 1) {
        let existingVoteIndex = newPost.votes.findIndex(
          (v) => v.value === -1 && v.authorId === clerkUser.user.id,
        );
        if (existingVoteIndex !== -1) {
          // newPost.numDownvotes -= 1;

          if (newPost.numUpvotes - newPost.numDownvotes !== 0) {
            newPost.numDownvotes -= 1;
          }
          newPost.votes.splice(existingVoteIndex, 1);
        }

        newPost.numUpvotes += 1;
        newVote.value = value;

        newPost.votes.push(newVote);
      } else {
        let existingVoteIndex = newPost.votes.findIndex(
          (v) => v.value === 1 && v.authorId === clerkUser.user.id,
        );
        if (existingVoteIndex !== -1) {
          if (newPost.numUpvotes - newPost.numDownvotes !== 0) {
            newPost.numUpvotes -= 1;
          }
          newPost.votes.splice(existingVoteIndex, 1);
        }
        newPost.numDownvotes += 1;
        newVote.value = value;
        newPost.votes.push(newVote);
      }
      setOptHasVoted(newVote);
    }

    setPostState(newPost);

    // Then send the mutation
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
    <div className="flex w-full gap-4 border-b border-b-gray-200 py-10">
      <div className="">
        <div className="flex flex-col items-center gap-[6px] ">
          <div className="flex h-6 items-center">
            <ChevronUp
              onClick={() => handleVote(1)}
              className={`cursor-pointer hover:stroke-indigo-600
          ${optHasVoted?.value === 1 && optHasVoted.authorId === (clerkUser && clerkUser.user && clerkUser.user.id ? clerkUser.user.id : null) ? "stroke-indigo-600 " : "stroke-gray-700"}
          `}
            />
          </div>

          <span className="font-medium text-gray-800">
            {postState.numUpvotes - postState.numDownvotes}
          </span>
          <div className="flex h-6 items-center">
            <ChevronDown
              onClick={() => handleVote(-1)}
              className={`cursor-pointer hover:stroke-indigo-600
            ${optHasVoted?.value === -1 && optHasVoted.authorId === (clerkUser && clerkUser.user && clerkUser.user.id ? clerkUser.user.id : null) ? "stroke-indigo-600 " : "stroke-gray-700"}
            `}
            />
          </div>
        </div>
      </div>
      <Link
        href={`/r/${author.username}/comments/${postState.id}/${toSnakeCase(postState.title)}`}
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
            Posted by <span className="lowercase">{author?.username}</span>{" "}
            {dayjs(postState.createdAt).fromNow()}
          </p>
        </div>

        <p className="font-medium ">{postState.title}</p>
        <p className="text-sm leading-[20px]">{postState.content}</p>
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
