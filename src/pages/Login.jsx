import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../firebase/auth";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError("Compila tutti i campi.");
    setLoading(true);
    setError("");
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch {
      setError("Email o password non valida. Riprova.");
    }
    setLoading(false);
  };

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

        {/* logo mark */}
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 22 }}>M</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
          Bentornato
        </h1>
        <p style={{ fontSize: 14, color: "rgba(199,210,254,0.85)", margin: 0, fontWeight: 400 }}>
          Accedi al tuo account Milestone
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

        {/* email */}
        <div style={inputWrap}>
          <span style={label}>Indirizzo email</span>
          <div style={{ position: "relative" }}>
            <Mail size={16} color="#d1d5db" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
        </div>

        {/* forgot */}
        <div style={{ textAlign: "right", marginBottom: 20, marginTop: -6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#4f46e5", cursor: "pointer" }}>
            Password dimenticata?
          </span>
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

        {/* sign in button */}
        <button
          onClick={handleLogin}
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
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "#f0f1f8" }} />
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#f0f1f8" }} />
        </div>

        {/* register link */}
        <p style={{ textAlign: "center", fontSize: 14, color: "#9ca3af", margin: 0 }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#4f46e5", fontWeight: 700, cursor: "pointer" }}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;