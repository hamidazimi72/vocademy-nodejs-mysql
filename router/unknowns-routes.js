import express from "express";

import { UnknownsController } from "../controllers/index.js";

const router = express.Router();

router.post("/", UnknownsController.createWord);
router.put("/:id", UnknownsController.updateTranslate);
router.post("/check-answer", UnknownsController.answerChecking);
router.get("/untranslate", UnknownsController.getAllUntranslatedWord);
router.get("/search-translate", UnknownsController.searchTranslate);
router.get("/question", UnknownsController.createQuestion);

export default router;
