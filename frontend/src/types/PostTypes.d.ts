import { User } from "./UserTypes";

export type IPost = {
  id: string;
  user: User;
  content: string;
  authorId: string;
};

export type CreatePostBody = { content: string };
