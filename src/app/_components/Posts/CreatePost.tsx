"use client";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import person from "assets/images/person.png";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ICreatePost {
  imageUrl: string;
  username: string;
}

export const CreatePost = (props: ICreatePost) => {
  const { username, imageUrl } = props;
  const form = useForm();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();

      setContent("");
      setTitle("");
    },
  });

  const formSchema = z.object({
    title: z
      .string()
      .min(3, {
        message: "Title has to be more than 3 characters",
      })
      .max(100, {
        message: "Title has to be less than 100 characters",
      }),
    content: z
      .string()
      .min(3, {
        message: "Content has to be more than 3 characters",
      })
      .max(280, {
        message: "Content has to be less than 280 characters",
      }),
  });

  const handleSubmit = (e: FormEvent) => {
    try {
      e.preventDefault();
      formSchema.parse({
        title,
        content,
      });
      createPost.mutate({ title, content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((err) => toast.warning(err.message));
      }
    }
  };

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
      <Form {...form}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex w-full flex-col gap-3 border-b border-b-gray-200 pb-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of your post"
              className="h-6 w-full border-none p-0 font-medium placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts with the world!"
              className="h-6 w-full border-none p-0 placeholder:text-gray-500  focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex justify-end pt-3">
            <Button
              disabled={createPost.isLoading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-800/20"
            >
              Post
            </Button>
          </div>
        </form>
      </Form>
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
