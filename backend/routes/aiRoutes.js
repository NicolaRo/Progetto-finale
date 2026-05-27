const express = require ("express");
const router = express.Router();
const authMiddleware = require ("../middleware/authMiddleware");
const {getHeroTip, chat} = require ("../controllers/aiController");

router.get("/hero-tip", authMiddleware, getHeroTip);
router.post("/chat", authMiddleware, chat);

module.exports = router;