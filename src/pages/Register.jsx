import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../firebase/auth";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) return setError("Compila tutti i campi.");
    if (password.length < 6) return setError("La password deve avere almeno 6 caratteri.");
    setLoading(true);
    setError("");
    try {
      await registerUser(email, password, fullName);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registrazione fallita. Riprova.");
    }
    setLoading(false);
  };

  const hasMinLength = password.length >= 6;

  const inputWrap = { position: "relative", marginBottom: 14 };
  const label = {
    fontSize: 10, fontWeight: 600, color: "#9ca3af",
    letterSpacing: "1.4px", textTransform: "uppercase",
    display: "block", marginBottom: 6,
  };
  const input = {
    width: "100%", boxSizing: "border-box",
    height: 52, borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    paddingLeft: 44, paddingRight: 16,
    fontSize: 14, color: "#111827",
    outline: "none", fontFamily: "inherit",
    transition: "border-color 0.15s, background 0.15s",
  };

  return (
    <div style={{ minHeight: "100svh", background: "#f0f1f8", display: "flex", flexDirection: "column" }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(160deg, #3730a3 0%, #4f46e5 100%)", padding: "52px 20px 48px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", cursor: "pointer", marginBottom: 28,
          }}
        >
          <ArrowLeft size={17} />
        </button>

        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16, fontSize: 22,
        }}>
          M
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
          Crea account
        </h1>
        <p style={{ fontSize: 14, color: "rgba(199,210,254,0.85)", margin: 0, fontWeight: 400 }}>
          Unisciti a Milestone Bank oggi — è gratuito
        </p>
      </div>

      {/* ── FORM CARD ── */}
      <div style={{
        flex: 1,
        background: "#fff",
        borderRadius: "28px 28px 0 0",
        marginTop: -24,
        padding: "28px 20px 40px",
      }}>

        {/* full name */}
        <div style={inputWrap}>
          <span style={label}>Nome completo</span>
          <div style={{ position: "relative" }}>
            <User size={16} color="#d1d5db" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Mario Rossi"
              style={input}
            />
          </div>
        </div>

        {/* email */}
        <div style={inputWrap}>
          <span style={label}>Indirizzo email</span>
          <div style={{ position: "relative" }}>
            <Mail size={16} color="#d1d5db" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={input}
            />
          </div>
        </div>

        {/* password */}
        <div style={inputWrap}>
          <span style={label}>Password</span>
          <div style={{ position: "relative" }}>
            <Lock size={16} color="#d1d5db" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...input, paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPassword((p) => !p)}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0,
              }}
              aria-label={showPassword ? "Nascondi password" : "Mostra password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* password strength hint */}
          {password.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <CheckCircle size={13} color={hasMinLength ? "#16a34a" : "#d1d5db"} />
              <span style={{ fontSize: 11, color: hasMinLength ? "#16a34a" : "#9ca3af", fontWeight: 500 }}>
                At least 6 characters
              </span>
            </div>
          )}
        </div>

        {/* error */}
        {error && (
          <div style={{
            background: "#fff1f2", border: "1px solid #fecdd3",
            borderRadius: 12, padding: "10px 14px", marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#e11d48", textAlign: "center", margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* terms note */}
        <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", lineHeight: 1.6, margin: "0 0 16px" }}>
          By creating an account, you agree to our{" "}
          <span style={{ color: "#4f46e5", fontWeight: 600, cursor: "pointer" }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ color: "#4f46e5", fontWeight: 600, cursor: "pointer" }}>Privacy Policy</span>
        </p>

        {/* register button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%", height: 52, borderRadius: 16,
            background: loading
              ? "#a5b4fc"
              : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            border: "none", color: "#fff",
            fontSize: 15, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", letterSpacing: "-0.2px",
            transition: "background 0.2s",
            marginBottom: 20,
          }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        {/* divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "#f0f1f8" }} />
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#f0f1f8" }} />
        </div>

        {/* login link */}
        <p style={{ textAlign: "center", fontSize: 14, color: "#9ca3af", margin: 0 }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#4f46e5", fontWeight: 700, cursor: "pointer" }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;