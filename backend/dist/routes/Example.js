"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initExampleRoutes = void 0;
const GeneratedSchemas_1 = require("../schemas/GeneratedSchemas");
function initExampleRoutes(app, {}) {
    app.post("/route", {
        schema: {
            body: GeneratedSchemas_1.ExampleBodySchema,
        },
    }, async (req, res) => {
        let { example, arr } = req.body;
        return res.send({
            echo: { example, arr },
        });
    });
}
exports.initExampleRoutes = initExampleRoutes;
//# sourceMappingURL=Example.js.map