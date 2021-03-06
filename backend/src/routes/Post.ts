import { Post } from "@prisma/client";
import { FastifyApp, Services } from "../types/common";
import { CreatePostBodyIRoute, PostIdParamsIRoute } from "../types/PostTypes";
import { PostErrors, UserErrors } from "../utils/Errors";
import { SendError, SendSuccess } from "../utils/HttpResponse";

export function initPostRoutes(app: FastifyApp, { prisma }: Services) {
  app.post<{
    Body: CreatePostBodyIRoute;
  }>(
    "/",
    {
      prefixTrailingSlash: "no-slash",
      schema: {
        description: "Create an user",
      },
    },
    async (req, res) => {
      const { content, images } = req.body;

      const { authorization } = req.headers;
      const accessToken = (authorization as string).split(" ")[1];
      let author = await prisma.user.findUnique({ where: { accessToken } });
      if (!author) return SendError(res, 400, UserErrors.NONEXISTENT_USER);

      const post = await prisma.post.create({
        data: { content, authorId: author.id, createdAt: new Date() },
      });

      await Promise.all(
        images.map(
          async (i) =>
            await prisma.image.create({
              data: { createdAt: new Date(), postId: post.id, id: i },
            })
        )
      );

      SendSuccess(res, 200, { ...post, author, likes: [], images });
    }
  );

  app.get<{}>(
    "/",
    {
      prefixTrailingSlash: "no-slash",
      schema: {
        description: "Get user by accessToken",
      },
    },
    async (req, res) => {
      const { authorization } = req.headers;
      const accessToken = (authorization as string).split(" ")[1];
      let user = await prisma.user.findUnique({
        where: { accessToken },
        include: { following: true },
      });
      if (!user) return SendError(res, 400, UserErrors.NONEXISTENT_USER);

      const posts = await prisma.post.findMany({
        orderBy: [{ createdAt: "desc" }],
        where: {
          authorId: {
            in: [...user.following.map((f) => f.followingUserId), user.id],
          },
        },
        include: {
          author: true,
          likes: true,
          images: true,
        },
      });

      const postsResponse = posts.map((p) => ({
        id: p.id,
        content: p.content,
        createdAt: p.createdAt,
        author: p.author,
        likes: p.likes.map((l) => l.userId),
        images: p.images.map((i) => i.id),
      }));

      SendSuccess(res, 200, postsResponse);
    }
  );

  app.patch<{ Params: PostIdParamsIRoute; Body: Partial<Post> }>(
    "/:postId",
    {
      prefixTrailingSlash: "no-slash",
      schema: {
        description: "Get user by accessToken",
      },
    },
    async (req, res) => {
      const { authorization } = req.headers;
      const { authorId, content } = req.body;
      const { postId } = req.params;
      const accessToken = (authorization as string).split(" ")[1];
      let user = await prisma.user.findUnique({ where: { accessToken } });

      if (!user) return SendError(res, 400, UserErrors.NONEXISTENT_USER);
      if (user.id !== authorId)
        return SendError(res, 400, PostErrors.NOT_AUTHOR);

      let post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          ...(content && { content }),
        },
      });

      SendSuccess(res, 200, post);
    }
  );

  app.get<{ Params: PostIdParamsIRoute }>(
    "/:postId/like",
    {
      prefixTrailingSlash: "no-slash",
      schema: {
        description: "Get user by accessToken",
      },
    },
    async (req, res) => {
      const { postId } = req.params;

      const { authorization } = req.headers;
      const accessToken = (authorization as string).split(" ")[1];
      let user = await prisma.user.findUnique({ where: { accessToken } });
      if (!user) return SendError(res, 400, UserErrors.NONEXISTENT_USER);

      const like = await prisma.like.create({
        data: { postId, userId: user.id, createdAt: new Date() },
      });

      SendSuccess(res, 200, like);
    }
  );

  app.delete<{ Params: PostIdParamsIRoute }>(
    "/:postId",
    {
      prefixTrailingSlash: "no-slash",
      schema: {
        description: "Get user by accessToken",
      },
    },
    async (req, res) => {
      const { authorization } = req.headers;
      const { postId } = req.params;
      const accessToken = (authorization as string).split(" ")[1];
      let user = await prisma.user.findUnique({ where: { accessToken } });

      if (!user) return SendError(res, 400, UserErrors.NONEXISTENT_USER);

      await prisma.like.deleteMany({ where: { postId } });
      await prisma.image.deleteMany({ where: { postId } });
      await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      SendSuccess(res, 200, {});
    }
  );
}
