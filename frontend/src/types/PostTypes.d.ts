import { User } from "./UserTypes";

export type IPost = {
  id: string;
  author: User;
  content: string;
  authorId: string;
  createdAt: Date;
  likes: string[];
  images: string[];
};

export type CreatePostBody = { content: string; images: Blob[] };

export type UpdatePostBody = { content: string; authorId: string };
