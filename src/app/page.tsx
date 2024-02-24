import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import { unstable_noStore as noStore } from "next/cache";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SingleFeedPost } from "./_components/Posts/SingleFeedPost";

export default async function Home() {
  noStore();

  return (
    <main className="feed h-screen w-screen overflow-y-auto pb-10">
      <div className=" w-[37.5rem]">
        <div className="pt-10">
          <CreatePost />
        </div>
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
      </div>
    </main>
  );
}

const CreatePost = () => {
  return (
    <div className="shadow-card-shadow flex w-full gap-4 rounded-xl border  border-gray-200 bg-white px-3 py-4">
      <div className="h-4 w-4 rounded-full bg-red-500"></div>
      <div className="w-full">
        <div className="flex w-full flex-col gap-3 border-b border-b-gray-200 pb-3">
          <Input
            placeholder="Title of your post"
            className="h-6 w-full border-none p-0 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Input
            placeholder="Share your thoughts with the world!"
            className="h-6 w-full border-none p-0 placeholder:text-gray-500  focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="pt-3 flex justify-end">
          <Button className="bg-indigo-500 hover:bg-indigo-600">Post</Button>
        </div>
      </div>
    </div>
  );
};
