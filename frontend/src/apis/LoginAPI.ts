import Configs from "../config.json";
import { LoginBody } from "../types/LoginType";

export async function LoginApi(body: LoginBody) {
  const response = await fetch(`${Configs.SERVER_URL}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
