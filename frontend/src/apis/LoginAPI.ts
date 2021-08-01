import { SERVER_URL } from "../config.json";
import { LoginBody } from "../types/LoginTypes";
import { User } from "../types/UserTypes";
import { toast } from "react-toastify";

export async function LoginApi(body: LoginBody): Promise<User | null> {
  const response = await fetch(`${SERVER_URL}/login`, {
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
