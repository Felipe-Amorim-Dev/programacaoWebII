import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API REST Futebol",
            version: "1.0.0",
            description: "API para cadastro de times e partidas"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./src/server.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}