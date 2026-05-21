import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { withdrawFunds } from "../firebase/firestore";
import BottomNav from "../components/ui/BottomNav";
import { ArrowLeft, ShieldCheck, Lock, Delete, ArrowUpCircle, MessageCircle,  } from "lucide-react";

const QUICK = [50, 100, 250, 500];

const Withdraw = () => {
  const navigate = useNavigate();
  const { userData, refreshUserData } = useAuth();
  const [amount, setAmount] = useState("");
  const [showTierSheet, setShowTierSheet] = useState(false);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [showContactToast, setShowContactToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const isTier2 = userData?.tier === 2;

  const handleKey = (val) => {
    if (val === "del") return setAmount((p) => p.slice(0, -1));
    if (val === "." && amount.includes(".")) return;
    if (amount.length >= 10) return;
    setAmount((p) => p + val);
  };

  const handleWithdraw = () => {
    if (!isTier2) return setShowTierSheet(true);
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) return setError("Enter a valid amount.");
    if (num > (userData?.balance || 0)) return setError("Insufficient balance.");
    setError("");
    setShowConfirmSheet(true);
  };

  const confirmWithdraw = async () => {
    setLoading(true);
    await withdrawFunds(userData.uid, parseFloat(amount));
    await refreshUserData();
    setSuccess(`$${parseFloat(amount).toLocaleString()} withdrawn successfully!`);
    setAmount("");
    setShowConfirmSheet(false);
    setLoading(false);
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleContactSupport = () => {
    setShowContactToast(true);
  };

  const keys = ["1","2","3","4","5","6","7","8","9",".","0","del"];
  const balance = Number(userData?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
  const displayAmount = amount || "0";

  const overlay = {
    position: "fixed", inset: 0, zIndex: 50,
    background: "rgba(10,10,30,0.5)",
    display: "flex", alignItems: "flex-end", justifyContent: "center",
  };
  const sheet = {
    background: "#fff", borderRadius: "24px 24px 0 0",
    width: "100%", maxWidth: 480,
    padding: "20px 20px 40px",
  };
  const handle = {
    width: 40, height: 4, borderRadius: 2,
    background: "#e5e7eb", margin: "0 auto 20px",
  };
  const cancelBtn = {
    flex: 1, height: 50, borderRadius: 14,
    border: "1px solid #e5e7eb", background: "#f9fafb",
    fontSize: 14, fontWeight: 600, color: "#6b7280",
    cursor: "pointer", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100svh", background: "#f0f1f8", display: "flex", flexDirection: "column", paddingBottom: 88 }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(160deg, #3730a3 0%, #4f46e5 100%)", padding: "52px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", cursor: "pointer",
            }}
          >
            <ArrowLeft size={17} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>
            Withdraw funds
          </span>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px", borderRadius: 16,
          background: isTier2 ? "rgba(52,211,153,0.18)" : "rgba(251,146,60,0.18)",
          border: `1px solid ${isTier2 ? "rgba(52,211,153,0.3)" : "rgba(251,146,60,0.3)"}`,
        }}>
          {isTier2
            ? <ShieldCheck size={18} color="#6ee7b7" style={{ flexShrink: 0 }} />
            : <Lock size={18} color="#fcd34d" style={{ flexShrink: 0 }} />}
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: isTier2 ? "#6ee7b7" : "#fcd34d", margin: 0, lineHeight: 1.3 }}>
              {isTier2 ? "Tier 2 — Withdrawals enabled" : "Tier 1 — Upgrade required"}
            </p>
            {!isTier2 && (
              <p style={{ fontSize: 10, color: "rgba(253,211,77,0.7)", margin: "2px 0 0" }}>
                Contact support to upgrade your account
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "16px 16px 0" }}>

        {/* balance */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1px solid #e8eaf0",
          padding: "16px 20px", marginBottom: 12, textAlign: "center",
        }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "1.4px", textTransform: "uppercase", margin: "0 0 4px" }}>
            Available balance
          </p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#111827", letterSpacing: "-0.5px", margin: 0 }}>
            ${balance}
          </p>
        </div>

        {/* amount */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1px solid #e8eaf0",
          padding: "16px 20px", marginBottom: 12,
        }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "1.4px", textTransform: "uppercase", margin: "0 0 10px" }}>
            Amount to withdraw
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#6366f1" }}>$</span>
            <span style={{ fontSize: 42, fontWeight: 700, color: amount ? "#111827" : "#d1d5db", letterSpacing: "-1px", lineHeight: 1 }}>
              {displayAmount}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 14 }}>
            {QUICK.map((q) => {
              const active = amount === String(q);
              return (
                <button key={q} onClick={() => setAmount(String(q))} style={{
                  height: 34, borderRadius: 10,
                  border: active ? "1.5px solid #6366f1" : "1px solid #e5e7eb",
                  background: active ? "#eef2ff" : "#f9fafb",
                  fontSize: 13, fontWeight: 600,
                  color: active ? "#4f46e5" : "#6b7280",
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  ${q}
                </button>
              );
            })}
          </div>
          {error && <p style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", margin: "10px 0 0" }}>{error}</p>}
          {success && <p style={{ fontSize: 12, fontWeight: 600, color: "#16a34a", margin: "10px 0 0" }}>{success}</p>}
        </div>

        {/* numpad */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
          {keys.map((k) => (
            <button key={k} onClick={() => handleKey(k)}
              style={{
                height: 60, borderRadius: 16,
                border: k === "del" ? "1px solid #fee2e2" : "1px solid #e8eaf0",
                background: k === "del" ? "#fff1f2" : "#fff",
                fontSize: 20, fontWeight: 700,
                color: k === "del" ? "#f87171" : "#111827",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontFamily: "inherit", transition: "transform 0.08s",
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.95)"}
              onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              {k === "del" ? <Delete size={20} /> : k}
            </button>
          ))}
        </div>

        <button onClick={handleWithdraw} style={{
          width: "100%", height: 52, borderRadius: 16,
          background: isTier2
            ? "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)"
            : "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
          border: "none", color: "#fff",
          fontSize: 15, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.2px",
        }}>
          {isTier2 ? <><ArrowUpCircle size={16} style={{ transform: "rotate(180deg)" }} /> Withdraw</> : <><Lock size={16} /> Upgrade to withdraw</>}
        </button>
      </div>

      {/* ── TIER UPGRADE SHEET ── */}
      {showTierSheet && (
        <div onClick={() => { setShowTierSheet(false); setShowContactToast(false); }} style={overlay}>
          <div onClick={(e) => e.stopPropagation()} style={sheet}>
            <div style={handle} />

            {/* contact toast — shown inside the sheet after button tap */}
            {showContactToast ? (
              <>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: "#eff6ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <MessageCircle size={30} color="#3b82f6" />
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.3px" }}>
                  Contact support
                </p>
                <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", margin: "0 0 20px", lineHeight: 1.6 }}>
                  To upgrade your account to Tier 2, please reach out to our support team. We'll verify your account and upgrade you — usually within minutes.
                </p>

                <div style={{
                  background: "#eff6ff", border: "1px solid #bfdbfe",
                  borderRadius: 14, padding: "14px 16px", marginBottom: 20,
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <MessageCircle size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", margin: "0 0 2px" }}>
                      How to get upgraded
                    </p>
                    <p style={{ fontSize: 12, color: "#3b82f6", margin: 0, lineHeight: 1.6 }}>
                      Go to Support in your profile and send a message requesting a Tier 2 upgrade. Our team will handle the rest.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { setShowContactToast(false); setShowTierSheet(false); }} style={cancelBtn}>
                    Close
                  </button>
                  <button
                    onClick={() => { setShowTierSheet(false); setShowContactToast(false); navigate("/support"); }}
                    style={{
                      flex: 2, height: 50, borderRadius: 14,
                      background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                      border: "none", fontSize: 14, fontWeight: 700, color: "#fff",
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    }}
                  >
                    <MessageCircle size={15} />
                    Go to support
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: "#fff7ed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <Lock size={30} color="#f97316" />
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.3px" }}>
                  Upgrade to Tier 2
                </p>
                <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", margin: "0 0 20px", lineHeight: 1.6 }}>
                  Unlock withdrawals and premium banking features — completely free.
                </p>

                <div style={{ background: "#f9fafb", borderRadius: 14, border: "1px solid #f0f1f8", padding: "4px 16px", marginBottom: 20 }}>
                  {["Unlimited withdrawals", "Higher transaction limits", "Priority support access", "Enhanced account security"].map((f, i, arr) => (
                    <div key={f} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "11px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid #f0f1f8" : "none",
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                        background: "#fff7ed",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <ShieldCheck size={12} color="#f97316" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowTierSheet(false)} style={cancelBtn}>Cancel</button>
                  <button
                    onClick={handleContactSupport}
                    style={{
                      flex: 2, height: 50, borderRadius: 14,
                      background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
                      border: "none", fontSize: 14, fontWeight: 700, color: "#fff",
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    }}
                  >
                    <MessageCircle size={15} />
                    Contact support
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── CONFIRM SHEET ── */}
      {showConfirmSheet && (
        <div onClick={() => !loading && setShowConfirmSheet(false)} style={overlay}>
          <div onClick={(e) => e.stopPropagation()} style={sheet}>
            <div style={handle} />
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: "#eef2ff",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <ArrowUpCircle size={30} color="#4f46e5" style={{ transform: "rotate(180deg)" }} />
            </div>
            <p style={{ fontSize: 38, fontWeight: 700, color: "#111827", letterSpacing: "-1px", textAlign: "center", margin: "0 0 4px" }}>
              ${parseFloat(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", margin: "0 0 20px" }}>
              will be deducted from your account
            </p>
            <div style={{ background: "#f9fafb", borderRadius: 14, border: "1px solid #f0f1f8", padding: "4px 16px", marginBottom: 20 }}>
              {[{ label: "From", value: "My wallet" }, { label: "Fee", value: "$0.00" }, { label: "Arrives", value: "1–2 business days" }].map(({ label, value }, i, arr) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "11px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #f0f1f8" : "none",
                }}>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowConfirmSheet(false)} disabled={loading} style={cancelBtn}>Cancel</button>
              <button onClick={confirmWithdraw} disabled={loading} style={{
                flex: 2, height: 50, borderRadius: 14,
                background: loading ? "#a5b4fc" : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                border: "none", fontSize: 14, fontWeight: 700, color: "#fff",
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>
                {loading ? "Processing..." : "Confirm withdrawal"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Withdraw;