import express from "express";
const router = express.Router();
import { requestPasswordReset, resetPassword } from "../controllers/resetPasswordController";

// POST - Request pwd reset (send email)
router.post("/request", requestPasswordReset);

// POST - set new password with token
router.post("/reset/:token", resetPassword);

export default router;
module.exports = router;