import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import { Input } from "~/components/ui/input";
import ReplyPost from "./ReplyPost";

export const MainPost = () => {
  return (
    <div className="border-b border-b-gray-200 pb-6">
      <div className="flex w-full gap-4  py-10">
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

          <p className="font-medium ">
            Honest opinions on Lime ebikes in London
          </p>
          <p className="text-sm leading-[20px]">
            Tell me your good and bad experiences of using Lime as a Rider in
            London
          </p>
        </div>
      </div>
      <ReplyPost />
    </div>
  );
};
