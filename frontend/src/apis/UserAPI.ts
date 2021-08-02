import { SERVER_URL } from "../config.json";
import { CreateUserBody, User } from "../types/UserTypes";
import { toast } from "react-toastify";
import { localStorageGetItem } from "../utils/localStorage";
import { ImageApi } from "./ImageAPI";

async function create(
  body: CreateUserBody,
  image: null | Blob
): Promise<User | null> {
  let avatar = "";
  if (image) {
    const imageResponse = await ImageApi.upload(image);
    if (imageResponse.status === 200) {
      avatar = imageResponse.id;
    }
  }

  const response = await fetch(`${SERVER_URL}/user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({ ...body, avatar }),
  });

  const responseObj = await response.json();
  if (response.status === 200) {
    return responseObj.data;
  } else {
    toast(responseObj.error.message, { type: "error" });
    return null;
  }
}

async function get(): Promise<User | null> {
  const accessToken = localStorageGetItem("ACCESS_TOKEN");
  const response: Response = await fetch(`${SERVER_URL}/user`, {
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

async function toFollow(): Promise<User[]> {
  const accessToken = localStorageGetItem("ACCESS_TOKEN");
  const response: Response = await fetch(`${SERVER_URL}/user/to-follow`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  const responseObj = await response.json();
  if (response.status === 200) {
    return responseObj.data;
  } else {
    toast(responseObj.error.message, { type: "error" });
    return [];
  }
}

async function follow(userId: string): Promise<User[]> {
  const accessToken = localStorageGetItem("ACCESS_TOKEN");
  const response: Response = await fetch(
    `${SERVER_URL}/user/follow/${userId}`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );

  const responseObj = await response.json();
  if (response.status === 200) {
    return responseObj.data;
  } else {
    toast(responseObj.error.message, { type: "error" });
    return [];
  }
}

export const UserApi = {
  create,
  get,
  toFollow,
  follow,
};
