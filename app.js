import express from "express";
import "dotenv/config";

import sequelize from "./db.js";

import UnknownsRoutes from "./router/unknowns-routes.js";
import KnownsRoutes from "./router/knowns-routes.js";
import ConfigsRoutes from "./router/configs-routes.js";
import { corsMiddleware, responseMiddleware } from "./middlewares/index.js";

const app = express();

app.use(corsMiddleware);
app.use(responseMiddleware);
app.use(express.json());

app.use("/api/v1/unknowns", UnknownsRoutes);
app.use("/api/v1/knowns", KnownsRoutes);
app.use("/api/v1/configs", ConfigsRoutes);

await sequelize.sync();
// await sequelize.sync({ force: true });

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
