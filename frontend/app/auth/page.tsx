"use client";

import { useState } from "react";
import { registerUser, loginUser } from "../../services/authService";
import styles from "./auth.module.css";

type Mode = "login" | "register";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiMsg, setApiMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (mode === "register" && !form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (mode === "register" && form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiMsg(null);
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await registerUser(form.name, form.email, form.password);
        localStorage.setItem("token", res.token);
        setApiMsg({ type: "success", text: "Account created successfully! Welcome 🎉" });
      } else {
        const res = await loginUser(form.email, form.password);
        localStorage.setItem("token", res.token);
        setApiMsg({ type: "success", text: "Logged in successfully! Redirecting to map..." });
        // TODO: router.push("/map")
      }
    } catch (err: any) {
      setApiMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  function switchMode(m: Mode) {
    setMode(m);
    setErrors({});
    setApiMsg(null);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.brandRow}>
            <span className={styles.brandIcon}>📍</span>
            <h1 className={styles.brandName}>GeoCart</h1>
          </div>
          <p className={styles.tagline}>
            {mode === "login"
              ? "Sign in to find the best prices near you"
              : "Create an account to get started"}
          </p>
        </div>

        {/* ── Card ── */}
        <div className={styles.card}>

          {/* Tab Toggle */}
          <div className={styles.tabs}>
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`${styles.tab} ${mode === "register" ? styles.tabActive : ""}`}
            >
              Register
            </button>
          </div>

          {/* API Message */}
          {apiMsg && (
            <div className={`${styles.alert} ${apiMsg.type === "success" ? styles.alertSuccess : styles.alertError}`}>
              {apiMsg.type === "success" ? "✅" : "⚠️"} {apiMsg.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className={styles.form}>

            {mode === "register" && (
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="Ahmad Khalil"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            {mode === "register" && (
              <div className={styles.field}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                />
                {errors.confirmPassword && (
                  <span className={styles.errorText}>{errors.confirmPassword}</span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${styles.submitBtn} ${loading ? styles.submitBtnDisabled : ""}`}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In →"
                : "Create Account →"}
            </button>
          </form>

          {/* Switch Mode */}
          <p className={styles.switchText}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span
              className={styles.switchLink}
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Register" : "Sign In"}
            </span>
          </p>
        </div>

        {/* ── Footer ── */}
        <p className={styles.footer}>
          Real-time prices &amp; availability across Lebanon 🇱🇧
        </p>
      </div>
    </main>
  );
}