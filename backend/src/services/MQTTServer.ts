import Aedes from "aedes";
import ws from "websocket-stream";
import http from "http";

const httpServer = http.createServer();
const aedes = Aedes();

const port = 8888;

// @ts-ignore
ws.createServer({ server: httpServer }, aedes.handle);

export async function initMQTTServer() {
  await new Promise((resolve) =>
    httpServer.listen(port, function () {
      console.log("websocket server listening on port ", port);
      resolve(true);
    })
  );

  return;
}
