"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMQTTClient = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
async function initMQTTClient() {
    let client = mqtt_1.default.connect("ws://localhost:8888");
    let mqttClient = await new Promise((resolve) => {
        client.on("connect", function () {
            resolve(client);
        });
    });
    return mqttClient;
}
exports.initMQTTClient = initMQTTClient;
//# sourceMappingURL=MQTTClient.js.map