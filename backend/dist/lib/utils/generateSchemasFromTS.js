"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const TJS = __importStar(require("typescript-json-schema"));
const promises_1 = __importDefault(require("fs/promises"));
const rimraf_1 = __importDefault(require("rimraf"));
/**
 * File that reads *IRoute types from types/
 * and generates schemas for it
 */
const BASE_PATH = "./src/types";
(async () => {
    // Read all files on base_path, there should be only router files
    let allTypeFiles = await promises_1.default.readdir(BASE_PATH);
    allTypeFiles = allTypeFiles.filter((file) => file.endsWith(".ts"));
    // Create a runner and a generator for transforming .ts into json schemas
    // pass, all .ts files into it
    const TJSProgram = TJS.getProgramFromFiles(allTypeFiles.map((fileName) => path_1.resolve(`${BASE_PATH}/${fileName}`)), 
    //typescript compiler flags so we can traverse any module
    {
        resolveJsonModule: true,
        esModuleInterop: true,
        lib: ["ES2020"],
    });
    const TJSGenerator = TJS.buildGenerator(TJSProgram, {});
    // Get all the symbols and filter them to only generate schemas
    // from Route symbols
    let TJSSymbols = TJSGenerator.getUserSymbols();
    let symbolsFiltered = TJSSymbols.filter((s) => s.endsWith("IRoute"));
    // Temporary folder for schemas
    await promises_1.default.mkdir("./src/schemas_temp");
    let schemaNames = [];
    // Generate all the schemas
    await Promise.all(symbolsFiltered.map(async (s) => {
        let schema = TJSGenerator.getSchemaForSymbol(s);
        let schemaName = s.replace("IRoute", "");
        if (["e.", ""].includes(schemaName))
            return;
        console.log(`Generated ${schemaName}.json`);
        schemaNames.push(schemaName);
        await promises_1.default.writeFile(`./src/schemas_temp/${schemaName}.json`, JSON.stringify(schema));
    }));
    console.log("Generated schemas import map");
    // At last, generate an index that exports all schemas so it's imported from a Schemas.{SchemaName} manner
    await promises_1.default.writeFile(`./src/schemas_temp/GeneratedSchemas.ts`, schemaNames
        .map((s) => `import ${s}Schema from "./${s}.json"\n` + `export { ${s}Schema }\n`)
        .join("\n"));
    /**
     * For fastify-swagger we need to put definitions on the initialization, that's why we merge all
     * types and inject them in a .json to be used in the initialization of the service.
     *
     * In that way, referencing types from $ref work nicely!
     */
    let allSchemas = TJSGenerator.getSchemaForSymbols(symbolsFiltered);
    await promises_1.default.writeFile(`./src/schemas_temp/definitions.json`, JSON.stringify(allSchemas));
    // Delete all schemas and move temporary folder as main folder
    await new Promise((res) => rimraf_1.default("./src/schemas", res));
    await promises_1.default.rename("./src/schemas_temp", "./src/schemas");
})();
//# sourceMappingURL=generateSchemasFromTS.js.map