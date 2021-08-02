import { User } from "./UserTypes";

export type IPost = {
  id: string;
  author: User;
  content: string;
  authorId: string;
  createdAt: Date;
  likes: string[];
};

export type CreatePostBody = { content: string };

export type UpdatePostBody = { content: string; authorId: string };
