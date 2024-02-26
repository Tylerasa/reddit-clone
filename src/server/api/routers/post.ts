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

  getSinglePost: privateProcedure
    .input(
      z.object({
        postId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.postId,
        },
        include: {
          votes: true,
          comments: true,
        },
      });

      const author = await clerkClient.users.getUser(ctx.userId);

      if (!author) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author for post not found. USER ID: ${ctx.userId}`,
        });
      }

      return {
        post,
        author: {
          id: author.id,
          username: author.firstName,
          imageUrl: author.imageUrl,
        },
      };
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

  comment: privateProcedure
    .input(
      z.object({
        text: z
          .string()
          .min(3, { message: "Comment has to be more than 3 characters" })
          .max(100, { message: "Comment has to be less than 100 characters" }),
        postId: z.number(),
        commentId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { text, postId, commentId } = input;

      const comment = await ctx.db.comment.create({
        data: {
          text,
          postId,
          authorId,
        },
      });

      if (commentId) {
        await ctx.db.comment.update({
          where: {
            id: comment.id,
          },
          data: {
            parentId: commentId,
          },
        });
      }

      return comment;
    }),

  getComments: publicProcedure
    .input(
      z.object({
        postId: z.number().optional(),
        parentId: z.number().optional(),
      }),
    )

    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.findMany({
        where: {
          postId: input.postId,
        },
        take: 100,
        orderBy: [{ createdAt: "desc" }],
        include: {
          votes: true,
          replies: {
            orderBy: { createdAt: "desc" },
            include: {
              replies: {
                include: {
                  votes: true,
                  replies: {
                    include: {
                      votes: true,
                      replies: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const users = (
        await clerkClient.users.getUserList({
          userId: comments.map((comment) => comment.authorId),
          limit: 100,
        })
      ).map(filteredUser);

      return comments.map((comment) => {
        const author = users.find((user) => user.id === comment.authorId);
        const replies = comment.replies.map((reply) => {
          const replyAuthor = users.find((u) => u.id === reply.authorId);
          return {
            ...reply,
            author: replyAuthor,
          };
        });

        if (!author) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Author for post not found. POST ID: ${comment.id}, USER ID: ${comment.authorId}`,
          });
        }

        return {
          comment: {
            ...comment,
            replies,
          },
          author,
        };
      });
    }),

  addUpVoteComment: privateProcedure
    .input(
      z.object({
        commentId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { commentId } = input;

      const existingVote = await ctx.db.vote.findFirst({
        where: { commentId, authorId },
      });

      if (existingVote?.value === -1) {
        await ctx.db.vote.delete({
          where: { id: existingVote.id },
        });
        await ctx.db.comment.update({
          where: { id: commentId },
          data: {
            numDownvotes: { decrement: 1 },
          },
        });
      }

      await ctx.db.vote.create({
        data: {
          commentId,
          value: 1,
          authorId,
        },
      });

      return ctx.db.comment.update({
        where: { id: commentId },
        data: {
          numUpvotes: {
            increment: 1,
          },
        },
      });
    }),

  removeUpVoteComment: privateProcedure
    .input(
      z.object({
        commentId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { commentId } = input;

      await ctx.db.vote.deleteMany({
        where: {
          commentId,
          authorId,
          value: 1,
        },
      });

      return ctx.db.post.update({
        where: { id: commentId },
        data: {
          numUpvotes: {
            decrement: 1,
          },
        },
      });
    }),

  addDownVoteComment: privateProcedure
    .input(
      z.object({
        commentId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { commentId } = input;

      const existingVote = await ctx.db.vote.findFirst({
        where: { commentId, authorId },
      });
      console.log("existingVote", existingVote);

      if (existingVote?.value === 1) {
        await ctx.db.vote.delete({
          where: { id: existingVote.id },
        });
        await ctx.db.post.update({
          where: { id: commentId },
          data: {
            numUpvotes: { decrement: 1 },
          },
        });
      }

      await ctx.db.vote.create({
        data: {
          commentId,
          value: -1,
          authorId,
        },
      });

      return ctx.db.post.update({
        where: { id: commentId },
        data: {
          numDownvotes: {
            increment: 1,
          },
        },
      });
    }),

  removeDownVoteComment: privateProcedure
    .input(
      z.object({
        commentId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { commentId } = input;

      const existingVote = await ctx.db.vote.findFirst({
        where: { id: commentId, authorId },
      });

      await ctx.db.vote.deleteMany({
        where: {
          commentId,
          authorId,
          value: -1,
        },
      });

      return ctx.db.post.update({
        where: { id: commentId },
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
