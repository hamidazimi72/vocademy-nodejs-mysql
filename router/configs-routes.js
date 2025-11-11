import express from "express";

import { ConfigController } from "../controllers/index.js";

const router = express.Router();

router.get("/", ConfigController.getAllConfigs);
router.get("/:symbol", ConfigController.getConfigBySymbol);
router.post("/", ConfigController.createConfig);
router.put("/:symbol", ConfigController.updateConfig);

export default router;
