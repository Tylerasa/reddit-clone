import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const filteredUser = (user: User) => {
  return {
    id: user.id,
    username: user.firstName,
    imageUrl: user.imageUrl,
  };
};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
      include: {
        votes: true,
        comments: true,
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filteredUser);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      if (!author) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
        });
      }

      return {
        post,
        author,
      };
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(3, { message: "Title has to be more than 3 characters" })
          .max(100, { message: "Title has to be less than 100 characters" }),
        content: z
          .string()
          .min(3, { message: "Title has to be more than 3 characters" })
          .max(280, { message: "Title has to be less than 280 characters" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { title, content } = input;
      const post = await ctx.db.post.create({
        data: {
          authorId,
          title,
          content,
        },
      });
      return post;
    }),
  addUpVote: privateProcedure
    .input(
      z.object({
        postId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { postId } = input;

      const existingVote = await ctx.db.vote.findFirst({
        where: { postId, authorId },
      });

      if (existingVote?.value === -1) {
        await ctx.db.vote.delete({
          where: { id: existingVote.id },
        });
        await ctx.db.post.update({
          where: { id: postId },
          data: {
            numDownvotes: { decrement: 1 },
          },
        });
      }

      await ctx.db.vote.create({
        data: {
          postId,
          value: 1,
          authorId,
        },
      });

      return ctx.db.post.update({
        where: { id: postId },
        data: {
          numUpvotes: {
            increment: 1,
          },
        },
      });
    }),

  removeUpVote: privateProcedure
    .input(
      z.object({
        postId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { postId } = input;

      await ctx.db.vote.deleteMany({
        where: {
          postId,
          authorId,
          value: 1,
        },
      });

      return ctx.db.post.update({
        where: { id: postId },
        data: {
          numUpvotes: {
            decrement: 1,
          },
        },
      });
    }),

  addDownVote: privateProcedure
    .input(
      z.object({
        postId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { postId } = input;

      const existingVote = await ctx.db.vote.findFirst({
        where: { postId, authorId },
      });
      console.log("existingVote", existingVote);

      if (existingVote?.value === 1) {
        await ctx.db.vote.delete({
          where: { id: existingVote.id },
        });
        await ctx.db.post.update({
          where: { id: postId },
          data: {
            numUpvotes: { decrement: 1 },
          },
        });
      }

      await ctx.db.vote.create({
        data: {
          postId,
          value: -1,
          authorId,
        },
      });

      return ctx.db.post.update({
        where: { id: postId },
        data: {
          numDownvotes: {
            increment: 1,
          },
        },
      });
    }),

  removeDownVote: privateProcedure
    .input(
      z.object({
        postId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { postId } = input;

      const existingVote = await ctx.db.vote.findFirst({
        where: { id: postId, authorId },
      });

      await ctx.db.vote.deleteMany({
        where: {
          postId,
          authorId,
          value: -1,
        },
      });

      return ctx.db.post.update({
        where: { id: postId },
        data: {
          numDownvotes: {
            decrement: 1,
          },
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
