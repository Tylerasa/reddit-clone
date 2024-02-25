import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import Image from "next/image";
import person from "assets/images/person.png";
import { RouterOutputs } from "~/trpc/shared";
import { useUser } from "@clerk/nextjs";

type PostWithUser = RouterOutputs["post"]["getAll"][number];

export const SingleFeedPost = (props: PostWithUser) => {
  const { author, post } = props;

  return (
    <div className="flex w-full gap-4 border-b border-b-gray-200 py-10">
      <div className="">
        <div className="flex flex-col items-center gap-[10px] ">
          <ChevronUp className="cursor-pointer stroke-gray-700 hover:stroke-indigo-600" />
          <span className="font-medium text-gray-800">
            {post.numUpvotes - post.numDownvotes}
          </span>
          <ChevronDown className="cursor-pointer stroke-gray-700 hover:stroke-indigo-600" />
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

          <p className="text-sm lowercase text-gray-600">
            Posted by {author?.username} 3 hours ago
          </p>
        </div>

        <p className="font-medium ">{post.title}</p>
        <p className="text-sm leading-[20px]">{post.content}</p>
      </div>
    </div>
  );
};
