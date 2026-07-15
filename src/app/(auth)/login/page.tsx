"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvex } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../../../../convex/_generated/api";

type Mode = "signIn" | "signUp" | "resetRequest" | "resetVerify";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuthActions();
  const convex = useConvex();

  const go = (m: Mode) => {
    setMode(m);
    setError("");
    setInfo("");
  };

  const finish = (result: unknown) => {
    if (result) {
      router.push(searchParams.get("redirect") || "/admin");
      router.refresh();
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      // In sign-in mode, create the account on first use so the user row
      // appears in the Convex `users` table (where an admin can be assigned).
      const existing =
        mode === "signIn"
          ? await convex.query(api.users.byEmail, { email })
          : null;
      const shouldSignUp = mode === "signUp" || !existing;

      const result = await signIn("password", {
        email,
        password,
        ...(shouldSignUp
          ? { flow: "signUp", profile: { name: name.trim() || undefined } }
          : {}),
      });
      finish(result);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, flow: "reset" });
      setInfo("If that account exists, a reset code is on its way. Check your inbox.");
      setMode("resetVerify");
    } catch (err: any) {
      setError(err?.message || "Could not start password reset");
    } finally {
      setLoading(false);
    }
  };

  const verifyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("password", {
        email,
        code,
        newPassword: password,
        flow: "reset-verification",
      });
      finish(result);
    } catch (err: any) {
      setError(err?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {mode === "signUp"
              ? "Create account"
              : mode === "resetRequest" || mode === "resetVerify"
                ? "Reset password"
                : "Sign in"}
          </CardTitle>
          <CardDescription>
            {mode === "signUp"
              ? "Register an admin account for the studio console."
              : mode === "resetRequest"
                ? "Enter your account email to receive a reset code."
                : mode === "resetVerify"
                  ? "Enter the code from your email and choose a new password."
                  : "Enter your email and password to access the admin panel."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "signIn" && (
            <form onSubmit={handleAuth} className="space-y-4">
              <Field id="email" label="Email" value={email} onChange={setEmail} type="email" placeholder="you@studio.com" />
              <Field id="password" label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
              {error && <ErrorText>{error}</ErrorText>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : "Sign in"}
              </Button>
              <div className="flex justify-between text-sm">
                <button type="button" onClick={() => go("signUp")} className="text-muted-foreground hover:text-foreground">
                  Create account
                </button>
                <button type="button" onClick={() => go("resetRequest")} className="text-muted-foreground hover:text-foreground">
                  Forgot password?
                </button>
              </div>
            </form>
          )}

          {mode === "signUp" && (
            <form onSubmit={handleAuth} className="space-y-4">
              <Field id="name" label="Name" value={name} onChange={setName} placeholder="Your name" />
              <Field id="email" label="Email" value={email} onChange={setEmail} type="email" placeholder="you@studio.com" />
              <Field id="password" label="Password" value={password} onChange={setPassword} type="password" placeholder="At least 8 characters" />
              {error && <ErrorText>{error}</ErrorText>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : "Create account"}
              </Button>
              <button type="button" onClick={() => go("signIn")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
                Already have an account? Sign in
              </button>
            </form>
          )}

          {mode === "resetRequest" && (
            <form onSubmit={requestReset} className="space-y-4">
              <Field id="email" label="Email" value={email} onChange={setEmail} type="email" placeholder="you@studio.com" />
              {error && <ErrorText>{error}</ErrorText>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset code"}
              </Button>
              <button type="button" onClick={() => go("signIn")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
                Back to sign in
              </button>
            </form>
          )}

          {mode === "resetVerify" && (
            <form onSubmit={verifyReset} className="space-y-4">
              <Field id="email" label="Email" value={email} onChange={setEmail} type="email" placeholder="you@studio.com" />
              <Field id="code" label="Reset code" value={code} onChange={setCode} placeholder="6-digit code from email" />
              <Field id="newPassword" label="New password" value={password} onChange={setPassword} type="password" placeholder="At least 8 characters" />
              {error && <ErrorText>{error}</ErrorText>}
              {info && <p className="text-sm text-emerald-400">{info}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset password"}
              </Button>
              <button type="button" onClick={() => go("signIn")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
                Back to sign in
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-destructive">{children}</p>;
}
