import { atom } from "jotai";
import { IPost } from "../types/PostTypes";

export const postsAtom = atom<IPost[]>([]);
