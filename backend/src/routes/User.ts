import {
  CreateUserBodySchema,
  UpdateUserBodySchema,
  UpdateUserParamsSchema,
} from "../schemas/GeneratedSchemas";
import { FastifyApp, Services } from "../types/common";
import {
  CreateUserBodyIRoute,
  UpdateUserBodyIRoute,
  UpdateUserParamsIRoute,
} from "../types/UserTypes";

export function initUserRoutes(app: FastifyApp, { prisma }: Services) {
  app.post<{
    Body: CreateUserBodyIRoute;
  }>(
    "/",
    {
      prefixTrailingSlash: "no-slash",
      schema: {
        body: CreateUserBodySchema,
      },
    },
    async (req) => {
      const { username } = req.body;

      let user = await prisma.user.create({
        data: {
          username,
        },
      });

      return { user };
    }
  );

  app.patch<{
    Body: UpdateUserBodyIRoute;
    Params: UpdateUserParamsIRoute;
  }>(
    "/:userId",
    {
      prefixTrailingSlash: "no-slash",
      schema: {
        params: UpdateUserParamsSchema,
        body: UpdateUserBodySchema,
      },
    },
    async (req) => {
      const { userId } = req.params;
      const { username, name } = req.body;

      let user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...(username && { username }),
          ...(name && { name }),
        },
      });

      return { user };
    }
  );

  app.get(
    "/all",
    async (req) => {
      let users = await prisma.user.findMany({});

      return { users };
    }
  );
}
