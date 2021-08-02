import { SERVER_URL } from "../config.json";
import { CreateUserBody, User } from "../types/UserTypes";
import { toast } from "react-toastify";
import { localStorageGetItem } from "../utils/localStorage";

async function create(body: CreateUserBody): Promise<User | null> {
  const response = await fetch(`${SERVER_URL}/user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
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

export const UserApi = {
  create,
  get,
};
