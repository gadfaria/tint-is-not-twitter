import fastify from "fastify";
import { initUserRoutes } from "./routes/User";
import { initDocumentation } from "./services/Documentation";
import fastifyCors from "fastify-cors";
import { Route } from "./types/common";
import { initMQTTServer } from "./services/MQTTServer";
import { initMQTTClient } from "./services/MQTTClient";
import { initPrisma } from "./services/initPrisma";

/**
 * Main server:
 *
 * Initialize the services, pass it to the routes and initialize
 * the routes.
 */

const app = fastify();
app.register(fastifyCors);

const API_VERSION = "v0.1.0";

async function main() {
  initDocumentation(app, API_VERSION);
  await initMQTTServer();
  const mqttClient = await initMQTTClient();
  const prisma = await initPrisma(mqttClient);

  /**
   * Route array with prefixes
   */
  const Routes: Route[] = [
    {
      init: initUserRoutes,
      prefix: "/user",
    },
  ];

  // Initialize all the routes in the array, passing the db for
  // operations and the app for creating handlers
  Routes.forEach((route) => {
    app.register(
      (app, opts, done) => {
        route.init(app, { mqttClient, prisma });
        console.log(`Initialized ${route.prefix}!`);
        done();
      },
      {
        prefix: route.prefix,
      }
    );
  });

  await app.ready();
  app.swagger();

  let listeningResult = await app.listen(6680, "0.0.0.0");
  console.log(`Fastify initialized at ${listeningResult}`);
}

main();
