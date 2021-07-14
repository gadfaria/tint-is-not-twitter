import { PrismaClient } from ".prisma/client";
import { Services } from "../types/common";

export async function initPrisma(mqttClient: Services["mqttClient"]) {
  const prisma = new PrismaClient();

  let result = await prisma.$queryRaw`
  pragma journal_mode = WAL;
  pragma synchronous = normal;
  pragma temp_store = memory;
  pragma mmap_size = 30000000000;
  `;

  prisma.$use(async (params, next) => {
    const result = await next(params);

    if (params.action === "update") {
      if (params.model === "User") {
        mqttClient.publish(
          `user/${params.args.where.id}`,
          JSON.stringify({ user: result })
        );
      }
    }

    if (params.action === "create" || params.action === "update") {
      if (params.model === "Comment") {
        let post = await prisma.post.findUnique({
          where: {
            id: result.postId,
          },
          include: {
            user: true, // Post owner
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
