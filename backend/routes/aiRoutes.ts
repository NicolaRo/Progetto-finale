import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware";
import { getHeroTip, chat } from "../controllers/aiController";

router.get("/hero-tip", authMiddleware, getHeroTip);
router.post("/chat", authMiddleware, chat);

export default router;
module.exports = router;