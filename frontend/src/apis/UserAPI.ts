import Configs from "../config.json";
import { CreateUserBody } from "../types/UserType";

async function create(body: CreateUserBody) {
  const response = await fetch(`${Configs.SERVER_URL}/user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export const UserApi = {
  create,
};
