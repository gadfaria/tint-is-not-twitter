import { LoginBodySchema } from "../schemas/GeneratedSchemas";
import { FastifyApp, Services } from "../types/common";
import { LoginBodyIRoute } from "../types/LoginTypes";
import bcrypt from "bcrypt";
import { UserErrors } from "../utils/Errors";
import { SendError, SendSuccess } from "../utils/HttpResponse";

export function initLoginRoutes(app: FastifyApp, { prisma }: Services) {
  app.post<{
    Body: LoginBodyIRoute;
  }>(
    "/",
    {
      prefixTrailingSlash: "no-slash",
      schema: {
        description: "Login and get user informations",
        body: LoginBodySchema,
      },
    },
    async (req, res) => {
      const { password, username } = req.body;

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) return SendError(res, 400, UserErrors.NONEXISTENT_USER);

      const match = await bcrypt.compare(password, user?.password);

      if (!match) return SendError(res, 400, UserErrors.INCORRECT_PASSWORD);

      SendSuccess(res, 200, user);
    }
  );
}
