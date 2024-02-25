import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import Image from "next/image";
import person from "assets/images/person.png";
import { RouterOutputs } from "~/trpc/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Skeleton } from "~/components/ui/skeleton";

dayjs.extend(relativeTime);

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
            Posted by {author?.username} {dayjs(post.createdAt).fromNow()}
          </p>
        </div>

        <p className="font-medium ">{post.title}</p>
        <p className="text-sm leading-[20px]">{post.content}</p>
      </div>
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
      <div className="flex flex-col gap-[6px] w-full">
        <div className="flex items-center gap-[6px]">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-[211px]" />
        </div>

        <Skeleton className="h-5 w-[322px] " />
        <div className="">
          <Skeleton className="h-4 w-full " />
          <Skeleton className="h-4 w-full my-1 " />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    </div>
  );
};
