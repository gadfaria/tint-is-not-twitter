export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  accessToken: string;
  avatar: string;
};

export type CreateUserBody = Omit<User, "id" | "accessToken" | "avatar">;
