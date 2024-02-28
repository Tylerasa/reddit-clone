"use client";
import React, { FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import person from "assets/images/person.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "~/components/ui/form";
import { useForm } from "react-hook-form";

const ReplyPost = (props: {
  postId: number;
  commentId?: number;
  imageUrl: string;
  username: string | null;
}) => {
  const { postId, imageUrl, username, commentId } = props;
  const [text, setText] = useState("");
  const form = useForm();

  const router = useRouter();
  const utils = api.useUtils();

  const comment = api.post.comment.useMutation({
    onSuccess: () => {
      setText("");
      utils.post.getComments.invalidate({ postId });
      router.refresh();
    },
  });

  const formSchema = z.object({
    text: z
      .string()
      .min(3, {
        message: "Content has to be more than 3 characters",
      })
      .max(100, {
        message: "Content has to be less than 100 characters",
      }),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      formSchema.parse({
        text,
      });
      comment.mutate({ text, postId, commentId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((err) => toast.warning(err.message));
      }
    }
  };

  return (
    <div className="flex w-full gap-4 rounded-xl border border-gray-200  bg-white px-3 py-4 shadow-card-shadow">
      <Image
        src={imageUrl}
        alt={`picture of ${username ?? ""}`}
        className="h-6 w-6 rounded-full"
        width={24}
        height={24}
      />
      <Form  {...form}>
        <form
          onSubmit={handleSubmit}
          className="w-full"
        >
          <div className="flex w-full flex-col gap-3 border-b border-b-gray-200 pb-3">
            <Input
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder="Comment your thoughts"
              className="h-6 w-full border-none p-0 placeholder:text-gray-500  focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex justify-end pt-3">
            <Button
              disabled={comment.isLoading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-800/20"
            >
              Comment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReplyPost;
