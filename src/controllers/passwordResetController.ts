import express from 'express';
import { User } from '../models/user.ts';
import { OtpCode } from '../models/otpCode.ts';
import { sendMail } from '../helpers/mailer.ts';
import bcrypt from 'bcryptjs';
import { generatePin } from '../helpers/index.ts';

const router = express.Router();

const EMAIL_SMTP_USERNAME = process.env.EMAIL_SMTP_USERNAME as string;
const CLIENT_URL = process.env.CLIENT_URL as string

export const forgotPassword = async (req: express.Request, res: express.Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ message: 'User not found!' });
        }

        await OtpCode.deleteMany({ email: user.email });

        const newOtpCodeDetails = {
            code: generatePin(4),
            email: user.email,
            expires_at: new Date(Date.now() + 15 * 60 * 1000) // OTP expires in 15 minutes
        }

        const otpCode = await OtpCode.create(newOtpCodeDetails);

        await sendMail(
            EMAIL_SMTP_USERNAME,
            user.email,
            // 'mrexcelsam1@gmail.com',
            "Password Reset OTP",
            `<p>Your account with email ${user.email} has been requested for password reset.</p>
            <p>Your OTP is: <b>${otpCode.code}</b></p>
            <p>Thank you for using our application!</p>
            <p><a href="${CLIENT_URL}/reset-password">Click here to reset your password</a></p>`
        );

         let data = {
            status: "success",
            message: "Password reset OTP sent successfully! Please check your email.",
        }

        return res.status(201).send(data);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' });
    }
}

export const resetPassword = async (req: express.Request, res: express.Response) => {
    try {
        const { email, otp, new_password } = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if(!otp || !new_password || !email) {
            return res.status(400).json({ message: "Required fields are missing!" });
        }

        const otpCode = await OtpCode.findOne({ email, code: otp });

        if(!otpCode) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if(otpCode.expires_at < new Date()) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        
        const hashedPassword = await bcrypt.hash(new_password, 12);
        user.password = hashedPassword;
        await user.save();

        await OtpCode.deleteMany({ email: user.email });

        let data = {
            status: "success",
            message: "Password reset successfully! Please login with your new password.",
        }

        return res.status(201).send(data);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' });
    }
}
