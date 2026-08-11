import express from "express";
const router = express.Router();

import { createCheckoutSession } from "../controllers/stripeController";
import authMiddleware from "../middleware/authMiddleware";

// POSTs
router.post("/create-checkout-session", authMiddleware, createCheckoutSession);

export default router;
module.exports = router;