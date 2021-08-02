import { toast } from "react-toastify";
import { SERVER_URL } from "../config.json";
import { CreatePostBody, IPost } from "../types/PostTypes";
import { User } from "../types/UserTypes";
import { localStorageGetItem } from "../utils/localStorage";

async function create(body: CreatePostBody): Promise<IPost | null> {
  const accessToken = localStorageGetItem("ACCESS_TOKEN");
  const response = await fetch(`${SERVER_URL}/post`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(body),
  });

  const responseObj = await response.json();
  if (response.status === 200) {
    return responseObj.data;
  } else {
    toast(responseObj.error.message, { type: "error" });
    return null;
  }
}

export async function get(): Promise<IPost[] | null> {
  const accessToken = localStorageGetItem("ACCESS_TOKEN");
  const response: Response = await fetch(`${SERVER_URL}/post`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  const responseObj = await response.json();
  if (response.status === 200) {
    return responseObj.data;
  } else {
    toast(responseObj.error.message, { type: "error" });
    return null;
  }
}

export const PostApi = {
  create,
  get,
};