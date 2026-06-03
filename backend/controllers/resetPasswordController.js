const crypto = require ("crypto");
const sgMail = require ("@sendgrid/mail");
const User = require ("../models/Users");
const bcryptjs = require("bcryptjs");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//1 Reset request generates a token and send an email
const requestPasswordReset = async (req, res) => {
    try {
        const {email} = req.body;

        const User = await User.findOne ({email});
        if(!user) {
            return res.status(200).json({message: "If this email exists, you will receive a reset link."});
        }

        //Generates a random token
        const token = crypto.randomBytes(32).toString("hex");

        //Save the token and set expiry time in the DB (1 hour)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save({validateBeforeSave: false});

        //Creating reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        //Send email via SendGrid
        const msg = {
            to: user.email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: "Packback - Reset your password",
            html:`
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                <h2>PackBack — Password Reset</h2>
                <p>Hi ${user.name},</p>
                <p>You requested to reset your password. Click the button below to set a new one:</p>
                <a href="${resetLink}" 
                    style="display: inline-block; padding: 12px 24px; background-color: #08edde; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Reset my password
                </a>
                <p style="margin-top: 16px; color: #888;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
            </div>`,
        };

        await sgMail.send(msg);

        return res.status(200).json({message: "If this email exists, you will receive a reset link."});
   
    } catch (error) {

        console.error("Reset password error:", error);
        return res.status(500).json({message: error.message});
    }
};

//Set a new password - check token and update the password
const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        //Find the user with valid token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now() },
        });

        if(!user) {
            return res.status(400).json({message: "Invalid or expired reset link."});   
        }

        if(!password || password.length < 8) {
            return res.status(400).json ({message: "Password must be at least 8 characters."});
        }

        //Update password and reset inputs
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({message: "Password updated successfully."});
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({message: error.message});
    }
};

module.exports =  {requestPasswordReset, resetPassword};