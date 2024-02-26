import { unstable_noStore as noStore } from "next/cache";
import { ArrowBack } from "assets/svgs/ArrowBack";
import { CommentPost } from "~/app/_components/Posts/CommentPost";
import Link from "next/link";
import MainPost from "~/app/_components/Posts/MainPost";
import CommentFeed from "~/app/_components/Comments/CommentFeed";

export default async function PostPage() {
  noStore();

  return (
    <main className="feed h-screen w-screen overflow-y-auto pb-10">
      <div className=" w-[37.5rem]">
        <div className="pt-6">
          <Link
            href="/"
            role="button"
            className="flex cursor-pointer items-center gap-4"
          >
            <ArrowBack className="stroke-gray-800" />
            <p className="text-sm font-medium text-gray-800">Back to posts</p>
          </Link>
          <MainPost />

          <div className="pt-6">
            <h3 className="pb-6 text-sm font-medium">All comments</h3>
            <CommentFeed />
          </div>
        </div>
      </div>
    </main>
  );
}
