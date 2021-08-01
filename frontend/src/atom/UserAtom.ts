import { atom } from "jotai";
import { User } from "../types/UserTypes";

export const userAtom = atom<User | null>(null);
