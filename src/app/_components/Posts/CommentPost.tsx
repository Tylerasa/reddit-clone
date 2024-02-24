"use client";
import person from "assets/images/person.png";
import { ChevronDown } from "assets/svgs/ChevronDown";
import { ChevronUp } from "assets/svgs/ChevronUp";
import { Reply } from "assets/svgs/Reply";
import Image from "next/image";
import { useRef, useState } from "react";
import ReplyPost from "./ReplyPost";

export const CommentPost = () => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  //   const ref = useRef(null);
  //   const click = () => {
  //     if (ref && ref.current) {
  //       console.log("ref", ref.current);
  //     }
  //   };
  return (
    <div
      // ref={ref}
      className=" pb-6"
    >
      <div className="flex w-full gap-4">
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center gap-[6px]">
            <Image
              src={person}
              alt="picture of an person"
              className="h-6 w-6"
            />
            <p className="text-sm text-gray-600 ">
              Posted by limerider 3 hours ago
            </p>
          </div>

          <p className="text-sm leading-[20px] text-gray-800">
            Lack of a text feedback box to describe an issue with a bike. I once
            had a bicycle that had a steering lockup when trying to turn left.
            Had to brake and stop otherwise would have driven straight onto
            oncoming traffic.
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <ChevronUp className="cursor-pointer stroke-gray-700 hover:stroke-indigo-600" />
            <span>6</span>
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
          <ReplyPost />
        </div>
      ) : null}
    </div>
  );
};
