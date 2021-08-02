import fastify from "fastify";

import { initDocumentation } from "./services/Documentation";
import fastifyCors from "fastify-cors";
import { initFileRoutes } from "./routes/Files";
import fastifyMultipart from "fastify-multipart";

/**
 * Main server:
 *
 * Initialize the services, pass it to the routes and initialize
 * the routes.
 */

const app = fastify();
app.register(fastifyCors);

app.register(fastifyMultipart);

const API_VERSION = "v0.1.0";

async function main() {
  initDocumentation(app, API_VERSION);

  /**
   * Route array with prefixes
   */
  const Routes = [
    {
      init: initFileRoutes,
      prefix: "/file",
    },
  ];

  // Initialize all the routes in the array, passing the db for
  // operations and the app for creating handlers
  Routes.forEach((route) => {
    app.register(
      (app, opts, done) => {
        route.init(app, {});
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

  let listeningResult = await app.listen(6780, "0.0.0.0");
  console.log(`Fastify initialized at ${listeningResult}`);
}

main();
