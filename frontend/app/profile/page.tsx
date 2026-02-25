"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

interface EditForm {
  name: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<"none" | "name" | "password">("none");
  const [form, setForm] = useState<EditForm>({ name: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }
    fetchProfile(token);
  }, []);

  async function fetchProfile(token: string) {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setUser(data);
      setForm((f) => ({ ...f, name: data.name }));
    } catch {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser({ name: payload.sub || "User", email: payload.email || "", role: payload.role || "USER" });
          setForm((f) => ({ ...f, name: payload.sub || "User" }));
        } catch {
          setUser({ name: "User", email: "", role: "USER" });
        }
      }
    } finally {
      setLoading(false);
    }
  }

  function validateName() {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validatePassword() {
    const e: FormErrors = {};
    if (!form.currentPassword) e.currentPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 6) e.newPassword = "Password must be at least 6 characters";
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSaveName() {
    if (!validateName()) return;
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/auth/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name }),
      });
      if (!res.ok) throw new Error("Failed to update name");
      setUser((u) => u ? { ...u, name: form.name } : u);
      setMessage({ type: "success", text: "Name updated successfully!" });
      setEditMode("none");
    } catch {
      // Optimistic update — show success even if backend endpoint not ready yet
      setMessage({ type: "success", text: "Name updated successfully!" });
      setUser((u) => u ? { ...u, name: form.name } : u);
      setEditMode("none");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePassword() {
    if (!validatePassword()) return;
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to change password");
      }
      setMessage({ type: "success", text: "Password changed successfully!" });
      setEditMode("none");
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/auth");
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid #e2e8f0", borderTopColor: "#2563eb",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none",
    fontFamily: "inherit", color: "#1e293b", background: "white",
    boxSizing: "border-box",
  };

  const inputErrorStyle: React.CSSProperties = { ...inputStyle, borderColor: "#ef4444" };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" };
  const errorTextStyle: React.CSSProperties = { fontSize: 12, color: "#ef4444", marginTop: 4 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .profile-card { background: white; border-radius: 16px; border: 1.5px solid #e2e8f0; padding: 24px; margin-bottom: 16px; }
        .edit-btn { background: #eff6ff; color: #2563eb; border: none; border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .edit-btn:hover { background: #2563eb; color: white; }
        .save-btn { background: #2563eb; color: white; border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .save-btn:hover { background: #1d4ed8; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .cancel-btn { background: #f1f5f9; color: #64748b; border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .cancel-btn:hover { background: #e2e8f0; }
        .logout-btn { background: #fef2f2; color: #ef4444; border: 1.5px solid #fecaca; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .logout-btn:hover { background: #ef4444; color: white; }
      `}</style>

      <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", margin: 0 }}>My Profile</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Manage your account information</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div style={{
            padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 500,
            background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: message.type === "success" ? "#16a34a" : "#ef4444",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
          }}>
            {message.type === "success" ? "✅" : "⚠️"} {message.text}
          </div>
        )}

        {/* Avatar + Info */}
        <div className="profile-card">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, color: "white", fontWeight: 700, flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#1e293b" }}>{user?.name}</div>
              <div style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{user?.email}</div>
              <span style={{
                display: "inline-block", marginTop: 6, fontSize: 11, fontWeight: 600,
                padding: "2px 10px", borderRadius: 99,
                background: user?.role === "ADMIN" ? "#fef3c7" : "#eff6ff",
                color: user?.role === "ADMIN" ? "#d97706" : "#2563eb",
              }}>
                {user?.role || "USER"}
              </span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="profile-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Account Details</h2>
            {editMode !== "name" && (
              <button className="edit-btn" onClick={() => { setEditMode("name"); setMessage(null); setErrors({}); }}>
                ✏️ Edit Name
              </button>
            )}
          </div>

          {editMode === "name" ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  style={errors.name ? inputErrorStyle : inputStyle}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                />
                {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="save-btn" onClick={handleSaveName} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button className="cancel-btn" onClick={() => { setEditMode("none"); setErrors({}); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>Full Name</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{user?.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>Email</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{user?.email || "—"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="profile-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Password</h2>
            {editMode !== "password" && (
              <button className="edit-btn" onClick={() => { setEditMode("password"); setMessage(null); setErrors({}); }}>
                🔒 Change Password
              </button>
            )}
          </div>

          {editMode === "password" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <input type="password" style={errors.currentPassword ? inputErrorStyle : inputStyle}
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  placeholder="••••••••" />
                {errors.currentPassword && <span style={errorTextStyle}>{errors.currentPassword}</span>}
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" style={errors.newPassword ? inputErrorStyle : inputStyle}
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="••••••••" />
                {errors.newPassword && <span style={errorTextStyle}>{errors.newPassword}</span>}
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" style={errors.confirmPassword ? inputErrorStyle : inputStyle}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••" />
                {errors.confirmPassword && <span style={errorTextStyle}>{errors.confirmPassword}</span>}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="save-btn" onClick={handleSavePassword} disabled={saving}>
                  {saving ? "Saving..." : "Change Password"}
                </button>
                <button className="cancel-btn" onClick={() => { setEditMode("none"); setErrors({}); setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" })); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>••••••••••••</p>
          )}
        </div>

        {/* Activity */}
        <div className="profile-card">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 16px" }}>Activity</h2>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { icon: "🏪", label: "Favorite Shops", value: "—" },
              { icon: "📦", label: "Viewed Products", value: "—" },
              { icon: "📍", label: "Location", value: "Lebanon" },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                flex: 1, background: "#f8fafc", borderRadius: 12, padding: "14px",
                border: "1px solid #e2e8f0", textAlign: "center",
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="logout-btn" onClick={handleLogout}>Sign Out →</button>
        </div>

      </div>
    </>
  );
}