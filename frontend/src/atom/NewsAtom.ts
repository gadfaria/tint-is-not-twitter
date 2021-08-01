import { atom } from "jotai";
import { News } from "../types/NewsType";

export const newsAtom = atom<News[]>([]);
