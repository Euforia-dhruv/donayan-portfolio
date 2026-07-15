import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Email } from "@convex-dev/auth/providers/Email";

const FROM = process.env.AUTH_EMAIL_FROM ?? "Donayan <onboarding@resend.dev>";

// Email provider used only to deliver the password-reset verification code.
const resetEmail = Email({
  from: FROM,
  sendVerificationRequest: async ({ identifier, token, url }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured in the Convex deployment.");
    }

    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0a0a0a;color:#f5f5f2;border-radius:12px">
        <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#c8a24d;margin:0">Donayan Studio</p>
        <h1 style="font-size:20px;font-weight:600;margin:8px 0 16px">Reset your password</h1>
        <p style="font-size:14px;line-height:1.6;color:#cfcfca">
          We received a request to reset the password for your admin account.
          Use the verification code below in the reset form:
        </p>
        <div style="margin:20px 0;padding:16px;text-align:center;background:#141414;border:1px solid rgba(245,245,242,.1);border-radius:10px">
          <span style="font-size:28px;font-weight:700;letter-spacing:.18em;color:#c8a24d">${token}</span>
        </div>
        <p style="font-size:13px;line-height:1.6;color:#9a9a95">
          This code expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: identifier,
        subject: "Reset your Donayan admin password",
        html,
        text: `Your Donayan password reset code is: ${token}\nThis code expires in 1 hour. If you didn't request this, ignore this email.`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Failed to send reset email (${res.status}): ${detail}`);
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      reset: resetEmail,
    }),
  ],
});
