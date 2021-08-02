import { Post } from "@prisma/client";

export type CreatePostBodyIRoute = { content: string, images:string[] };

export type PostIdParamsIRoute = { postId: string };
