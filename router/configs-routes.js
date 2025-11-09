import express from "express";

import { ConfigController } from "../controllers/index.js";

const router = express.Router();

router.get("/", ConfigController.getAllSymbols);
router.get("/:symbol", ConfigController.getBySymbol);
router.post("/", ConfigController.createConfig);
router.put("/", ConfigController.updateValue);

export default router;
