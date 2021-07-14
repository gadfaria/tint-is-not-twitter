"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const User_1 = require("./routes/User");
const Documentation_1 = require("./services/Documentation");
const fastify_cors_1 = __importDefault(require("fastify-cors"));
const MQTTServer_1 = require("./services/MQTTServer");
const MQTTClient_1 = require("./services/MQTTClient");
const initPrisma_1 = require("./services/initPrisma");
/**
 * Main server:
 *
 * Initialize the services, pass it to the routes and initialize
 * the routes.
 */
const app = fastify_1.default();
app.register(fastify_cors_1.default);
const API_VERSION = "v0.1.0";
async function main() {
    Documentation_1.initDocumentation(app, API_VERSION);
    await MQTTServer_1.initMQTTServer();
    const mqttClient = await MQTTClient_1.initMQTTClient();
    const prisma = await initPrisma_1.initPrisma(mqttClient);
    /**
     * Route array with prefixes
     */
    const Routes = [
        {
            init: User_1.initUserRoutes,
            prefix: "/user",
        },
    ];
    // Initialize all the routes in the array, passing the db for
    // operations and the app for creating handlers
    Routes.forEach((route) => {
        app.register((app, opts, done) => {
            route.init(app, { mqttClient, prisma });
            console.log(`Initialized ${route.prefix}!`);
            done();
        }, {
            prefix: route.prefix,
        });
    });
    await app.ready();
    app.swagger();
    let listeningResult = await app.listen(6680, "0.0.0.0");
    console.log(`Fastify initialized at ${listeningResult}`);
}
main();
//# sourceMappingURL=index.js.map