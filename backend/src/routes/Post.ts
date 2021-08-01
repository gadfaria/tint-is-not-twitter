import { FastifyApp, Services } from "../types/common";
import { CreatePostBodyIRoute } from "../types/PostTypes";
import { UserErrors } from "../utils/Errors";
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
      const { body } = req;

      const { authorization } = req.headers;
      const accessToken = (authorization as string).split(" ")[1];
      let user = await prisma.user.findUnique({ where: { accessToken } });
      if (!user) return SendError(res, 400, UserErrors.NONEXISTENT_USER);

      const post = await prisma.post.create({
        data: { ...body, authorId: user.id, createdAt: new Date() },
      });

      SendSuccess(res, 200, post);
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
      let user = await prisma.user.findUnique({ where: { accessToken } });
      if (!user) return SendError(res, 400, UserErrors.NONEXISTENT_USER);

      const posts = await prisma.post.findMany();
      SendSuccess(res, 200, posts);
    }
  );
}
