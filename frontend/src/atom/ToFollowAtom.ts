import { atom } from "jotai";
import { User } from "../types/UserTypes";

export const toFollowAtom = atom<User[]>([]);
