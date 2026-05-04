import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER || 'your_email@example.com',
        pass: process.env.EMAIL_PASS || 'your_password'
    }
});

export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${token}`;
    
    const mailOptions = {
        from: `"Retro Forum" <${process.env.EMAIL_USER || 'no-reply@retroforum.com'}>`,
        to: email,
        subject: 'Email Verification - Retro Forum',
        html: `
            <div style="font-family: 'Courier New', Courier, monospace; border: 2px solid #000; padding: 20px; background-color: #f0f0f0;">
                <h1 style="color: #000080; border-bottom: 1px solid #000;">Retro Forum</h1>
                <p>Hello,</p>
                <p>Thank you for registering. Please verify your email by clicking the link below:</p>
                <p><a href="${verificationUrl}" style="background-color: #c0c0c0; border: 1px solid #000; padding: 5px 10px; text-decoration: none; color: #000;">Verify Email Address</a></p>
                <p>If you did not register for this account, please ignore this email.</p>
                <hr />
                <p style="font-size: 12px;">This is an automated message. Please do not reply.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};
