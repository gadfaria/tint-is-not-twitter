export const UserErrors = {
  USERNAME_ALREADY_EXISTS: {
    code: "USERNAME_ALREADY_EXISTS",
    message: "Username já existe",
  },
  NONEXISTENT_USER: {
    code: "NONEXISTENT_USER",
    message: "Usuário não encontrado",
  },
  INCORRECT_PASSWORD: {
    code: "NONEXISTENT_USER",
    message: "Senha incorreta",
  },
  USER_ALREADY_EXISTS: {
    code: "USER_ALREADY_EXISTS",
    message: "Usuário já existente",
  },
};

export const PostErrors = {
  NOT_AUTHOR: {
    code: "NOT_AUTHOR",
    message: "Usuário não é o autor do post",
  },
};

export const Errors = {
  SERVER_ERROR: {
    code: "SERVER_ERROR",
    message: "Erro interno! Tente novamente mais tarde",
  },
};
