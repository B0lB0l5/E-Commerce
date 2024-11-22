import dotenv from "dotenv";
import express from "express";
import path from "path";
import { dbConnection } from "./database/connection.js";
import { bootstrap } from "./src/bootstrap.js";
const app = express();
const port = 3000;

dotenv.config({ path: path.resolve("./config/.env") });
dbConnection();
bootstrap(app, express);
app.listen(port, () =>
    console.log(`E-Commerce app listening on port ${port}!`)
);
