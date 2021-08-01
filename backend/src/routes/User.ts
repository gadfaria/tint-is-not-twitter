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
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { SendError, SendSuccess } from "../utils/HttpResponse";
import { UserErrors } from "../utils/Errors";

const SALT_ROUNDS = 10;

export function initUserRoutes(app: FastifyApp, { prisma }: Services) {
  app.post<{
    Body: CreateUserBodyIRoute;
  }>(
    "/",
    {
      prefixTrailingSlash: "no-slash",
      schema: {
        description: "Create an user",
        body: CreateUserBodySchema,
      },
    },
    async (req, res) => {
      const { password, username } = req.body;

      const userExist = await prisma.user.findUnique({ where: { username } });
      if (userExist)
        return SendError(res, 400, UserErrors.USERNAME_ALREADY_EXISTS);

      const passwordWithHash = await bcrypt.hash(password, SALT_ROUNDS);

      const accessToken = nanoid();

      let user = await prisma.user.create({
        data: {
          ...req.body,
          password: passwordWithHash,
          accessToken,
          createdAt: new Date(),
        },
      });

      SendSuccess(res, 200, user);
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

      SendSuccess(res, 200, user);
    }
  );
}
