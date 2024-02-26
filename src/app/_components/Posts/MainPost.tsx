"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import ClientMainPost from "./ClientMainPost";
import { RouterOutputs } from "~/trpc/shared";
dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["post"]["getAll"][number];

function MainPost() {
  const params = useParams<{ username: string; id: string; title: string }>();
  const id = Number(params.id);

  const { data, isLoading } = api.post.getSinglePost.useQuery({ postId: id });
  let dt = data as PostWithUser;
  if (isLoading || !data) return <MainPostSkeleton />;

  return <ClientMainPost {...dt} />;
}

export default MainPost;

export const MainPostSkeleton = () => (
  <div>
    <div className="-gray-200 flex w-full gap-4 py-10">
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
    <div className="flex h-auto w-full gap-4 rounded-xl border border-gray-200 bg-white  px-3 py-4  shadow-card-shadow">
      <div className="">
        <Skeleton className="block h-6 w-6 rounded-full" />
      </div>
      <div className="w-full">
        <div className="flex w-full flex-col gap-3 border-b border-b-gray-200 pb-3">
          <Skeleton className="h-5 w-[271px] " />
        </div>
        <div className="flex justify-end pt-3">
          <Skeleton className="h-[36px] w-[91px] " />
        </div>
      </div>
    </div>
  </div>
);
