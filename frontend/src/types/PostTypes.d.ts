import { User } from "./UserTypes";

export type IPost = {
  id: string;
  user: User;
  content: string;
  authorId: string;
  createdAt: Date;
};

export type CreatePostBody = { content: string };
