import express from "express";

import { KnownsController } from "../controllers/index.js";

const router = express.Router();

router.get("/", KnownsController.getAllKnowns);
router.delete("/:id", KnownsController.returnToUnknowns);
router.post("/move-to-knowns", KnownsController.moveToKnowns);

export default router;
