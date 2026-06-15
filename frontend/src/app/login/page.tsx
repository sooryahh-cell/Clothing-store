"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

type ViewState = "login" | "forgotPassword" | "resetPassword";

export default function LoginPage() {
  const [viewState, setViewState] = useState<ViewState>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
        setSuccessMessage("Login successful! Redirecting...");
        setSuccess(true);
        setTimeout(() => router.push("/"), 1000);
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(`Cannot connect to server at ${apiUrl}. If using Render, it may be waking up—please wait 30 seconds and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("OTP sent to your email!");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setViewState("resetPassword");
        }, 2000);
      } else {
        setError(data.error || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Password reset successfully! You can now log in.");
        setSuccess(true);
        setPassword("");
        setOtp("");
        setNewPassword("");
        setTimeout(() => {
          setSuccess(false);
          setViewState("login");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (response: any) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
        setSuccessMessage("Google Login successful! Redirecting...");
        setSuccess(true);
        setTimeout(() => router.push("/"), 1000);
      } else {
        setError(data.error || "Google login failed.");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeGoogle = () => {
      const google = (window as any).google;
      if (typeof window !== "undefined" && google) {
        try {
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
            callback: handleGoogleLogin,
          });

          const btnElement = document.getElementById("google-signin-btn");
          if (btnElement) {
            google.accounts.id.renderButton(btnElement, {
              theme: "filled_black",
              size: "large",
              width: btnElement.clientWidth || 380,
              shape: "pill",
            });
          }
        } catch (e) {
          console.error("Google script initialization failed:", e);
        }
      }
    };

    if (viewState === "login") {
      const google = (window as any).google;
      if (typeof window !== "undefined" && google) {
        initializeGoogle();
      } else {
        const interval = setInterval(() => {
          const googleCheck = (window as any).google;
          if (typeof window !== "undefined" && googleCheck) {
            initializeGoogle();
            clearInterval(interval);
          }
        }, 500);
        return () => clearInterval(interval);
      }
    }
  }, [viewState]);


  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>
          {viewState === "login" && "Welcome Back"}
          {viewState === "forgotPassword" && "Forgot Password"}
          {viewState === "resetPassword" && "Reset Password"}
        </h1>
        <p className={styles.subtitle}>
          {viewState === "login" && "Log in to your Terra Fit account."}
          {viewState === "forgotPassword" && "Enter your email to receive an OTP."}
          {viewState === "resetPassword" && "Enter the OTP sent to your email and your new password."}
        </p>

        {error && <div className={styles.error}>⚠ {error}</div>}
        {success && <div className={styles.success}>✅ {successMessage}</div>}

        {viewState === "login" && (
          <form className={styles.form} onSubmit={handleLogin} method="post">
            <div className={styles.formGroup}>
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="login-password">Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <span 
                className={styles.forgotPassword} 
                onClick={() => {
                  setError("");
                  setSuccess(false);
                  setViewState("forgotPassword");
                }}
              >
                Forgot Password?
              </span>
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoading || success}>
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <div className={styles.googleContainer}>
              <div id="google-signin-btn" className={styles.googleButton}></div>
            </div>
          </form>
        )}

        {viewState === "forgotPassword" && (
          <form className={styles.form} onSubmit={handleForgotPassword} method="post">
            <div className={styles.formGroup}>
              <label htmlFor="forgot-email">Email Address</label>
              <input
                type="email"
                id="forgot-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading || success}>
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
            <span 
              className={styles.backToLogin} 
              onClick={() => {
                setError("");
                setSuccess(false);
                setViewState("login");
              }}
            >
              Back to Login
            </span>
          </form>
        )}

        {viewState === "resetPassword" && (
          <form className={styles.form} onSubmit={handleResetPassword} method="post">
            <div className={styles.formGroup}>
              <label htmlFor="reset-otp">OTP (6-digit)</label>
              <input
                type="text"
                id="reset-otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="123456"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="reset-new-password">New Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="reset-new-password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading || success}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
            <span 
              className={styles.backToLogin} 
              onClick={() => {
                setError("");
                setSuccess(false);
                setViewState("login");
              }}
            >
              Back to Login
            </span>
          </form>
        )}

        {viewState === "login" && (
          <p className={styles.switchText}>
            Don&apos;t have an account?
            <Link href="/register" className={styles.switchLink}>Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
}
