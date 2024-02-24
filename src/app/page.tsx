import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import { unstable_noStore as noStore } from "next/cache";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default async function Home() {
  noStore();

  return (
    <main className="feed h-screen w-screen overflow-y-auto pb-10">
      <div className=" w-[37.5rem]">
        <div className="pt-10">
          <CreatePost />
        </div>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </main>
  );
}

const Post = () => {
  return (
    <div className="flex w-full gap-4 border-b border-b-gray-200 py-10">
      <div className="">
        <div className="flex flex-col items-center gap-[10px] ">
          <ChevronUp className="cursor-pointer stroke-gray-700 hover:stroke-indigo-600" />
          <span className="font-medium text-gray-800">150</span>
          <ChevronDown className="cursor-pointer stroke-gray-700 hover:stroke-indigo-600" />
        </div>
      </div>
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center gap-[6px]">
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
          <p className="text-sm text-gray-600 ">
            Posted by limerider 3 hours ago
          </p>
        </div>

        <p className="font-medium ">Honest opinions on Lime ebikes in London</p>
        <p className="text-sm leading-[20px]">
          Tell me your good and bad experiences of using Lime as a Rider in
          London
        </p>
      </div>
    </div>
  );
};

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
