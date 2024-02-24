import { unstable_noStore as noStore } from "next/cache";
import { ArrowBack } from "assets/svgs/ArrowBack";
import { MainPost } from "~/app/_components/Posts/MainPost";
import { CommentPost } from "~/app/_components/Posts/CommentPost";

export default async function PostPage() {
  noStore();

  return (
    <main className="feed h-screen w-screen overflow-y-auto pb-10">
      <div className=" w-[37.5rem]">
        <div className="pt-6">
          <div role="button" className="flex cursor-pointer items-center gap-4">
            <ArrowBack className="stroke-gray-800" />
            <p className="text-sm font-medium text-gray-800">Back to posts</p>
          </div>
          <MainPost/>
          
          <div className="pt-6">
            <h3 className="font-medium text-sm pb-6">All comments</h3>
            <CommentPost/>
            <CommentPost/>
            <CommentPost/>
            <CommentPost/>

          </div>
        </div>
      </div>
    </main>
  );
}
