import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer'
// If your Prisma file is located elsewhere, you can change the path


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.App_User,
    pass: process.env.App_Pass,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  trustedOrigins: [process.env.BETTER_AUTH_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "User",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "Active",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },


  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      // void sendEmail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   text: `Click the link to verify your email: ${url}`,
      // });

      // console.log(user,url,token);

      const verificationUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${token}`

      const info = await transporter.sendMail({
    from: '"blog post backend" <maddison53@ethereal.email>',
    to: user.email,
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
     html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f6f6f6; padding: 30px;">
    <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
      
      <h2 style="color: #222; margin-bottom: 10px;">
        Verify your email
      </h2>

      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        Hi <strong>${user.name ?? "there"}</strong>,
      </p>

      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        Thanks for signing up. Please confirm your email address by clicking the button below.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}"
           style="
             background-color: #000;
             color: #ffffff;
             padding: 12px 24px;
             text-decoration: none;
             font-weight: 600;
             border-radius: 6px;
             display: inline-block;
           ">
          Verify Email
        </a>
      </div>

      <p style="color: #777; font-size: 14px; line-height: 1.6;">
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="font-size: 13px; word-break: break-all;">
        <a href="${verificationUrl}" style="color: #0066cc;">
          ${verificationUrl}
        </a>
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

      <p style="color: #999; font-size: 12px;">
        If you didn’t create an account, you can safely ignore this email.
      </p>

      <p style="color: #999; font-size: 12px;">
        — Blog Post Team
      </p>
    </div>
  </div>
  `, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
    },
  },
});
