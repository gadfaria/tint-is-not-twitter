"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserRoutes = void 0;
const GeneratedSchemas_1 = require("../schemas/GeneratedSchemas");
function initUserRoutes(app, { prisma }) {
    app.post("/", {
        prefixTrailingSlash: "no-slash",
        schema: {
            body: GeneratedSchemas_1.CreateUserBodySchema,
        },
    }, async (req) => {
        const { username } = req.body;
        let user = await prisma.user.create({
            data: {
                username,
            },
        });
        return { user };
    });
    app.patch("/:userId", {
        prefixTrailingSlash: "no-slash",
        schema: {
            params: GeneratedSchemas_1.UpdateUserParamsSchema,
            body: GeneratedSchemas_1.UpdateUserBodySchema,
        },
    }, async (req) => {
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
    });
    app.get("/all", async (req) => {
        let users = await prisma.user.findMany({});
        return { users };
    });
}
exports.initUserRoutes = initUserRoutes;
//# sourceMappingURL=User.js.map