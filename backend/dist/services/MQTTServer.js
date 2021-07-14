"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMQTTServer = void 0;
const aedes_1 = __importDefault(require("aedes"));
const websocket_stream_1 = __importDefault(require("websocket-stream"));
const http_1 = __importDefault(require("http"));
const httpServer = http_1.default.createServer();
const aedes = aedes_1.default();
const port = 8888;
// @ts-ignore
websocket_stream_1.default.createServer({ server: httpServer }, aedes.handle);
async function initMQTTServer() {
    await new Promise((resolve) => httpServer.listen(port, function () {
        console.log("websocket server listening on port ", port);
        resolve(true);
    }));
    return;
}
exports.initMQTTServer = initMQTTServer;
//# sourceMappingURL=MQTTServer.js.map