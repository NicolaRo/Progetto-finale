const express = require ("express");
const router = express.Router();
const {requestPasswordReset, resetPassword} = require("../controllers/resetPasswordController");

// POST - Request pwd reset (send email)
router.post("/request", requestPasswordReset);

//POST - set new password with token
router.post("/reset/:token", resetPassword);

module.exports =router;