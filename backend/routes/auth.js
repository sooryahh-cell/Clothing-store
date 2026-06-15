const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { BrevoClient } = require('@getbrevo/brevo');
const crypto = require('crypto');

// Configure Brevo (Sendinblue) Email Client
const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY || '' });

function buildOtpEmailHtml(otp) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Terra Fit - Password Reset</title>
    </head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;border:1px solid #222;overflow:hidden;max-width:500px;width:100%;">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1a1a1a,#0a0a0a);padding:32px 40px;text-align:center;border-bottom:1px solid #222;">
                  <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:0.1em;color:#c9ff3b;text-transform:uppercase;">TERRA FIT</h1>
                  <p style="margin:6px 0 0;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;">Premium Activewear</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin:0 0 12px;color:#fff;font-size:20px;font-weight:700;">Password Reset Request</h2>
                  <p style="margin:0 0 28px;color:#888;font-size:15px;line-height:1.6;">We received a request to reset your Terra Fit account password. Use the OTP below to proceed. It expires in <strong style="color:#c9ff3b;">10 minutes</strong>.</p>
                  <!-- OTP Box -->
                  <div style="background:#0a0a0a;border:2px solid #c9ff3b;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                    <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Your One-Time Password</p>
                    <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:0.2em;color:#c9ff3b;font-family:'Courier New',monospace;">${otp}</p>
                  </div>
                  <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">If you did not request this, you can safely ignore this email. Your password will remain unchanged.</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#0d0d0d;padding:20px 40px;text-align:center;border-top:1px solid #222;">
                  <p style="margin:0;color:#444;font-size:12px;">&copy; ${new Date().getFullYear()} Terra Fit. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email already exists' });

        await User.create({ name, email, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

        // Generate token using the auto-increment integer ID
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'terrafit_secret_key_123', { expiresIn: '7d' });
        
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                _id: user.id, // Keep _id alias for compatibility
                name: user.name, 
                email: user.email 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// FORGOT PASSWORD - Request OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP and expiration (10 minutes from now)
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send OTP Email via Brevo
        if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'your_brevo_api_key_here') {
            // Fallback for dev: log OTP to console
            console.log(`[DEV MODE] Password reset OTP for ${user.email}: ${otp}`);
            return res.json({ message: 'OTP sent to your email.' });
        }

        const sendSmtpEmail = {
            sender: { name: 'Terra Fit', email: process.env.BREVO_SENDER_EMAIL || 'noreply@terrafit.com' },
            to: [{ email: user.email, name: user.name }],
            subject: '🔐 Your Terra Fit Password Reset OTP',
            textContent: `Your Terra Fit password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`,
            htmlContent: buildOtpEmailHtml(otp)
        };

        await brevo.transactionalEmails.sendTransacEmail(sendSmtpEmail);
        res.json({ message: 'OTP sent to your email.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Error sending OTP' });
    }
});

// VERIFY OTP & RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        const user = await User.findOne({ 
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        if (user.resetPasswordOtp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        // Update password (hash will be applied by the beforeUpdate hook)
        user.password = newPassword;
        user.resetPasswordOtp = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Error resetting password' });
    }
});

// GOOGLE AUTHENTICATION
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ error: 'Google credential (ID Token) is required' });
        }

        const clientID = process.env.GOOGLE_CLIENT_ID;
        if (!clientID) {
            console.error('GOOGLE_CLIENT_ID is not configured in backend .env file');
            return res.status(500).json({ error: 'Server configuration error: Google Client ID is missing' });
        }

        const { google } = require('googleapis');
        const client = new google.auth.OAuth2(clientID);

        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: clientID,
            });
            payload = ticket.getPayload();
        } catch (err) {
            console.error('Error verifying Google Token:', err.message);
            return res.status(400).json({ error: 'Invalid Google credential' });
        }

        const { email, name } = payload;
        if (!email) {
            return res.status(400).json({ error: 'Email not provided by Google account' });
        }

        // Find or create the user in database
        let user = await User.findOne({ where: { email } });
        if (!user) {
            // Generate a random secure password for database validation (allowNull: false)
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
                name: name || 'Google User',
                email,
                password: randomPassword
            });
        }

        // Generate backend JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'terrafit_secret_key_123', { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                _id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Google Auth Route Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;