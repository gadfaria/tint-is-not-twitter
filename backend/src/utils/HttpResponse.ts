import { FastifyReply } from "fastify";

export const SendSuccess = (
  res: FastifyReply,
  status: number,
  data?: unknown
) => {
  res.status(status).send({
    status: "ok",
    data,
  });
};

export const SendError = (
  res: FastifyReply,
  status: number,
  error?: unknown
) => {
  res.code(status).send({
    status: "error",
    error: error,
  });
};
