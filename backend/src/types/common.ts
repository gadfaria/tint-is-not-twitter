import { FastifyLoggerInstance } from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import { Server, IncomingMessage, ServerResponse } from "http";
import { initPrisma } from "../services/initPrisma";
import { initMQTTClient } from "../services/MQTTClient";

// Helper for fastify, much more compact
export type FastifyApp = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyLoggerInstance
>;

// Helper for Route, considering services
export interface Route {
  init: (app: FastifyApp, services: Services) => void;
  prefix: string;
}

// Handy interface for Services that return a Promise
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export interface Services {
  // Something as:
  prisma: Awaited<ReturnType<typeof initPrisma>>;
  mqttClient: Awaited<ReturnType<typeof initMQTTClient>>;
}
