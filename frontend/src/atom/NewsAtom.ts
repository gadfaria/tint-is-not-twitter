import { atom } from "jotai";
import { News } from "../types/NewsTypes";

export const newsAtom = atom<News[]>([]);
