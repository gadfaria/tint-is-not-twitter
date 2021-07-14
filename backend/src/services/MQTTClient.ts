import mqtt, { MqttClient } from "mqtt";

export async function initMQTTClient() {
  let client = mqtt.connect("ws://localhost:8888");

  let mqttClient = await new Promise<MqttClient>((resolve) => {
    client.on("connect", function () {
      resolve(client);
    });
  });

  return mqttClient;
}
