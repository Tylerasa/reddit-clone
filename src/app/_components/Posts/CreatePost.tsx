import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import person from "assets/images/person.png";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import { useState } from "react";

interface ICreatePost {
  imageUrl: string;
  username: string;
}

export const CreatePost = (props: ICreatePost) => {
  const { username, imageUrl } = props;

  const createPost = api.post.create.useMutation({
    onSuccess: () => {},
  });

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="flex w-full gap-4 rounded-xl border border-gray-200  bg-white px-3 py-4 shadow-card-shadow">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`picture of ${username}`}
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ title, content });
        }}
        className="w-full"
      >
        <div className="flex w-full flex-col gap-3 border-b border-b-gray-200 pb-3">
          <Input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of your post"
            className="h-6 w-full border-none p-0 font-medium placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Input
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts with the world!"
            className="h-6 w-full border-none p-0 placeholder:text-gray-500  focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex justify-end pt-3">
          <Button className="bg-indigo-500 hover:bg-indigo-600">Post</Button>
        </div>
      </form>
    </div>
  );
};

export const CreatePostSkeleton = () => (
  <div className="flex h-[149px] w-full gap-4 rounded-xl border border-gray-200  bg-white px-3 py-4 shadow-card-shadow">
    <div className="">
      <Skeleton className="block h-6 w-6 rounded-full" />
    </div>
    <div className="w-full">
      <div className="flex w-full flex-col gap-3 border-b border-b-gray-200 pb-3">
        <Skeleton className="h-5 w-[129px] " />
        <Skeleton className="h-5 w-[271px] " />
      </div>
      <div className="flex justify-end pt-3">
        <Skeleton className="h-[36px] w-[55px] " />
      </div>
    </div>
  </div>
);
