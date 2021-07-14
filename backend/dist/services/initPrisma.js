"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPrisma = void 0;
const client_1 = require(".prisma/client");
async function initPrisma(mqttClient) {
    const prisma = new client_1.PrismaClient();
    let result = await prisma.$queryRaw `
  pragma journal_mode = WAL;
  pragma synchronous = normal;
  pragma temp_store = memory;
  pragma mmap_size = 30000000000;
  `;
    prisma.$use(async (params, next) => {
        const result = await next(params);
        if (params.action === "update") {
            if (params.model === "User") {
                mqttClient.publish(`user/${params.args.where.id}`, JSON.stringify({ user: result }));
            }
        }
        if (params.action === "create" || params.action === "update") {
            if (params.model === "Comment") {
                let post = await prisma.post.findUnique({
                    where: {
                        id: result.postId,
                    },
                    include: {
                        user: true,
                        comments: {
                            include: {
                                user: true, // Comment owner
                            },
                        },
                    },
                });
                if (post)
                    mqttClient.publish(`post/${post.id}`, JSON.stringify({ post }));
            }
        }
        // See results here
        return result;
    });
    return prisma;
}
exports.initPrisma = initPrisma;
//# sourceMappingURL=initPrisma.js.map