import { toast } from "react-toastify";
import { SERVER_URL } from "../config.json";
import { CreatePostBody, IPost, UpdatePostBody } from "../types/PostTypes";
import { User } from "../types/UserTypes";
import { localStorageGetItem } from "../utils/localStorage";
import { ImageApi } from "./ImageAPI";

async function create(body: CreatePostBody): Promise<IPost | null> {
  const { content, images } = body;

  const imageIds = await Promise.all(
    images.map(async (image) => {
      const response = await ImageApi.upload(image);
      if (response.status === 200) {
        return response.id;
      }
      return null;
    })
  );

  const accessToken = localStorageGetItem("ACCESS_TOKEN");
  const response = await fetch(`${SERVER_URL}/post`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify({ content, images: imageIds }),
  });

  const responseObj = await response.json();
  if (response.status === 200) {
    return responseObj.data;
  } else {
    toast(responseObj.error.message, { type: "error" });
    return null;
  }
}

async function get(): Promise<IPost[] | null> {
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

async function like(postId: string): Promise<IPost[] | null> {
  const accessToken = localStorageGetItem("ACCESS_TOKEN");
  const response: Response = await fetch(`${SERVER_URL}/post/${postId}/like`, {
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

async function update(
  body: UpdatePostBody,
  postId: string
): Promise<IPost | null> {
  const accessToken = localStorageGetItem("ACCESS_TOKEN");
  const response = await fetch(`${SERVER_URL}/post/${postId}`, {
    method: "PATCH",
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

export const PostApi = {
  create,
  get,
  update,
  like,
};
