import swagger from "fastify-swagger";

// Compiled definitions
import { resolve } from "path";
import { FastifyApp } from "../types/common";

export function initDocumentation(app: FastifyApp, version: string) {
  app.register(swagger, {
    routePrefix: "/docs",
    mode: "static",
    specification: {
      path: resolve(__dirname + "../../../upload_open_api.yaml"),
    },
    exposeRoute: true,
  } as any);

  console.log(`Documentation started at /docs!`);
}
