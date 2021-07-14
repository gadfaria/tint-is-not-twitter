"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDocumentation = void 0;
const fastify_swagger_1 = __importDefault(require("fastify-swagger"));
// Compiled definitions
const definitions_json_1 = __importDefault(require("../schemas/definitions.json"));
function initDocumentation(app, version) {
    app.register(fastify_swagger_1.default, {
        routePrefix: "/docs",
        swagger: {
            info: {
                title: "Auth API",
                description: "Documentation for the Auth API",
                version,
            },
            // host: "localhost",
            schemes: ["http", "https"],
            consumes: ["application/json"],
            produces: ["application/json"],
            /**
             * Inject compiled definitions here!
             */
            definitions: {
                ...definitions_json_1.default.definitions,
            },
            securityDefinitions: {
                apiKey: {
                    type: "apiKey",
                    name: "apiKey",
                    in: "header",
                },
            },
        },
        exposeRoute: true,
    });
    console.log(`Documentation started at /docs!`);
}
exports.initDocumentation = initDocumentation;
//# sourceMappingURL=Documentation.js.map