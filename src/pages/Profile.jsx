import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../firebase/auth";
import BottomNav from "../components/ui/BottomNav";
import {
  ChevronRight, User, Bell, Lock, HelpCircle,
  ArrowUpCircle, Shield, LogOut, MessageCircle, Copy, Check,
} from "lucide-react";

const card = {
  background: "#ffffff", borderRadius: 20,
  border: "1px solid #e8eaf0", padding: "4px 16px", marginBottom: 12,
};
const sectionTitle = {
  fontSize: 10, fontWeight: 600, color: "#9ca3af",
  letterSpacing: "1.4px", textTransform: "uppercase",
  padding: "14px 0 6px", display: "block",
};

const MenuItem = ({ icon: Icon, label, sublabel, onClick, danger = false, badge, iconBg = "#eef2ff", iconColor = "#4f46e5" }) => (
  <button onClick={onClick} style={{
    width: "100%", display: "flex", alignItems: "center", gap: 12,
    padding: "12px 0",
    background: "transparent", border: "none",
    borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#f3f4f6",
    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
      background: danger ? "#fff1f2" : iconBg,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon size={18} color={danger ? "#f87171" : iconColor} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: danger ? "#f87171" : "#111827", margin: 0, lineHeight: 1.3 }}>{label}</p>
      {sublabel && <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sublabel}</p>}
    </div>
    {badge && (
      <span style={{ background: "#eef2ff", color: "#4f46e5", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, flexShrink: 0 }}>
        {badge}
      </span>
    )}
    {!danger && <ChevronRight size={15} color="#d1d5db" style={{ flexShrink: 0 }} />}
  </button>
);

const Profile = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => { await logoutUser(); navigate("/"); };

  const handleCopyAccNumber = () => {
    const accNumber = userData?.accountNumber || userData?.uid?.slice(0, 10).toUpperCase();
    navigator.clipboard.writeText(accNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const initials = (userData?.fullName || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const isTier2 = userData?.tier === 2;
  const accNumber = userData?.accountNumber || userData?.uid?.slice(0, 10).toUpperCase() || "—";

  const overlay = {
    position: "fixed", inset: 0, zIndex: 50,
    background: "rgba(10,10,30,0.5)",
    display: "flex", alignItems: "flex-end", justifyContent: "center",
  };
  const sheet = { background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "20px 20px 40px" };
  const handle = { width: 40, height: 4, borderRadius: 2, background: "#e5e7eb", margin: "0 auto 20px" };
  const cancelBtn = {
    flex: 1, height: 50, borderRadius: 14,
    border: "1px solid #e5e7eb", background: "#f9fafb",
    fontSize: 14, fontWeight: 600, color: "#6b7280",
    cursor: "pointer", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100svh", background: "#f0f1f8", paddingBottom: 88 }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(160deg, #3730a3 0%, #4f46e5 100%)", padding: "52px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color: "#fff",
          }}>
            {initials}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 20,
            background: isTier2 ? "rgba(52,211,153,0.2)" : "rgba(251,146,60,0.2)",
            border: `1px solid ${isTier2 ? "rgba(52,211,153,0.35)" : "rgba(251,146,60,0.35)"}`,
          }}>
            <Shield size={10} color={isTier2 ? "#6ee7b7" : "#fcd34d"} />
            <span style={{ fontSize: 10, fontWeight: 700, color: isTier2 ? "#6ee7b7" : "#fcd34d" }}>
              {isTier2 ? "Tier 2 · Verified" : "Tier 1 · Basic"}
            </span>
          </div>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 2px", letterSpacing: "-0.3px" }}>{userData?.fullName}</h2>
        <p style={{ fontSize: 12, color: "rgba(199,210,254,0.85)", margin: 0, fontWeight: 500 }}>{userData?.email}</p>
      </div>

      {/* ── STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "14px 16px 0" }}>

        {/* balance */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8eaf0", padding: "14px 16px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "1.2px", textTransform: "uppercase", margin: "0 0 4px" }}>Saldo</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#4f46e5", margin: 0, letterSpacing: "-0.3px" }}>
            ${Number(userData?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* card */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8eaf0", padding: "14px 16px" }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "1.2px", textTransform: "uppercase", margin: "0 0 4px" }}>Carta</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "1px" }}>
            •••• {userData?.cardNumber || "3245"}
          </p>
        </div>
      </div>

      {/* ── ACCOUNT NUMBER CARD ── */}
      <div style={{ padding: "10px 16px 0" }}>
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e8eaf0",
          padding: "14px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "1.2px", textTransform: "uppercase", margin: "0 0 4px" }}>
              Numero conto
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "1.5px", fontVariantNumeric: "tabular-nums" }}>
              {accNumber}
            </p>
          </div>
          <button
            onClick={handleCopyAccNumber}
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: copied ? "#f0fdf4" : "#f4f5fb",
              border: `1px solid ${copied ? "#bbf7d0" : "#e8eaf0"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s",
            }}
            aria-label="Copy account number"
          >
            {copied
              ? <Check size={15} color="#16a34a" />
              : <Copy size={15} color="#6b7280" />}
          </button>
        </div>

        {/* copied toast */}
        {copied && (
          <div style={{
            marginTop: 8,
            display: "flex", alignItems: "center", gap: 6,
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 10, padding: "8px 12px",
          }}>
            <Check size={13} color="#16a34a" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>
              Numero conto copiato!
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "0 16px" }}>
        <span style={sectionTitle}>Account</span>
        <div style={card}>
          <MenuItem icon={User} label="Informazioni personali" sublabel={userData?.fullName} />
          <MenuItem icon={Bell} label="Notifiche" sublabel="Gestisci i tuoi avvisi" iconBg="#fff7ed" iconColor="#f97316" />
          <MenuItem icon={Lock} label="Sicurezza" sublabel="Password e PIN" iconBg="#f5f3ff" iconColor="#8b5cf6" />
        </div>

        {!isTier2 && (
          <>
            <span style={sectionTitle}>Membership</span>
            <div style={{ ...card, background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)", border: "1px solid #fed7aa" }}>
              <MenuItem
                icon={ArrowUpCircle} label="Aggiorna a Tier 2"
                sublabel="Contatta il supporto per sbloccare i prelievi"
                onClick={() => { setShowUpgrade(true); setShowContactInfo(false); }}
                iconBg="#ffedd5" iconColor="#f97316"
              />
            </div>
          </>
        )}

        <span style={sectionTitle}>Altro</span>
        <div style={card}>
          <MenuItem icon={HelpCircle} label="Supporto" sublabel="Chat con il supporto Milestone" onClick={() => navigate("/support")} iconBg="#eff6ff" iconColor="#3b82f6" />
          {userData?.role === "admin" && (
            <MenuItem icon={Shield} label="Pannello admin" sublabel="Gestisci utenti e supporto" onClick={() => navigate("/admin")} />
          )}
        </div>

        <div style={card}>
          <MenuItem icon={LogOut} label="Esci" danger onClick={() => setShowLogout(true)} />
        </div>
      </div>

      {/* ── UPGRADE SHEET ── */}
      {showUpgrade && (
        <div onClick={() => { setShowUpgrade(false); setShowContactInfo(false); }} style={overlay}>
          <div onClick={(e) => e.stopPropagation()} style={sheet}>
            <div style={handle} />
            {showContactInfo ? (
              <>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <MessageCircle size={30} color="#3b82f6" />
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.3px" }}>Contatta il supporto</p>
                <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", margin: "0 0 20px", lineHeight: 1.6 }}>
                  Per aggiornare il tuo account a Tier 2, invia un messaggio al nostro team di supporto. Ti verificheremo e aggiorneremo — solitamente entro pochi minuti.
                </p>
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <MessageCircle size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", margin: "0 0 3px" }}>Come funziona</p>
                    <p style={{ fontSize: 12, color: "#3b82f6", margin: 0, lineHeight: 1.6 }}>
                      Apri Supporto dal menu e invia un messaggio dicendo che vorresti aggiornare a Tier 2. Il nostro team si occuperà del resto.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { setShowUpgrade(false); setShowContactInfo(false); }} style={cancelBtn}>Chiudi</button>
                  <button
                    onClick={() => { setShowUpgrade(false); setShowContactInfo(false); navigate("/support"); }}
                    style={{ flex: 2, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)", border: "none", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                  >
                    <MessageCircle size={15} /> Vai al supporto
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "#ffedd5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <ArrowUpCircle size={30} color="#f97316" />
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.3px" }}>Aggiorna a Tier 2</p>
                <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", margin: "0 0 20px", lineHeight: 1.6 }}>Sblocca l'esperienza Milestone completa — completamente gratuita.</p>
                <div style={{ background: "#f9fafb", borderRadius: 14, border: "1px solid #f0f1f8", padding: "4px 16px", marginBottom: 20 }}>
                  {["Prelievi illimitati", "Limiti di transazione superiori", "Supporto prioritario", "Sicurezza avanzata"].map((f, i, arr) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid #f0f1f8" : "none" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, background: "#ffedd5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Shield size={12} color="#f97316" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowUpgrade(false)} style={cancelBtn}>Annulla</button>
                  <button
                    onClick={() => setShowContactInfo(true)}
                    style={{ flex: 2, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)", border: "none", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                  >
                    <MessageCircle size={15} /> Contatta supporto
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── LOGOUT SHEET ── */}
      {showLogout && (
        <div onClick={() => setShowLogout(false)} style={overlay}>
          <div onClick={(e) => e.stopPropagation()} style={sheet}>
            <div style={handle} />
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <LogOut size={28} color="#f87171" />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#111827", textAlign: "center", margin: "0 0 6px" }}>Esci?</p>
            <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", margin: "0 0 24px", lineHeight: 1.6 }}>
              Dovrai accedere di nuovo per accedere al tuo account Milestone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowLogout(false)} style={cancelBtn}>Annulla</button>
              <button onClick={handleLogout} style={{ flex: 2, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)", border: "none", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                Sì, esci
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Profile;