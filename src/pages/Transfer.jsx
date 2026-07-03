import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAllUsers, fundUserAccount, withdrawFunds } from "../firebase/firestore";
import BottomNav from "../components/ui/BottomNav";
import { ArrowLeft, Search, CheckCircle, Send } from "lucide-react";

const QUICK_AMOUNTS = [50, 100, 250, 500];

const Transfer = () => {
  const navigate = useNavigate();
  const { userData, refreshUserData } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    setSearched(true);
    const all = await getAllUsers();
    setUsers(
      all.filter(
        (u) =>
          u.uid !== userData?.uid &&
          u.fullName.toLowerCase().includes(search.toLowerCase())
      )
    );
    setSearching(false);
  };

  const handleTransfer = () => {
    if (!selected) return setError("Seleziona un destinatario.");
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) return setError("Inserisci un importo valido.");
    if (num > (userData?.balance || 0)) return setError("Saldo insufficiente.");
    setError("");
    setShowConfirm(true);
  };

  const confirmTransfer = async () => {
    setLoading(true);
    await withdrawFunds(userData.uid, parseFloat(amount));
    await fundUserAccount(selected.uid, parseFloat(amount), userData.uid);
    await refreshUserData();
    setSuccess(`$${parseFloat(amount).toLocaleString()} inviati a ${selected.fullName}!`);
    setAmount("");
    setSelected(null);
    setUsers([]);
    setSearch("");
    setSearched(false);
    setShowConfirm(false);
    setLoading(false);
    setTimeout(() => setSuccess(""), 4000);
  };

  const balance = Number(userData?.balance || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });

  // ─── inline style tokens ──────────────────────────────────────────────────
  const card = {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e8eaf0",
    padding: "18px 16px",
    marginBottom: 12,
  };

  const sectionLabel = {
    fontSize: 10,
    fontWeight: 600,
    color: "#9ca3af",
    letterSpacing: "1.4px",
    textTransform: "uppercase",
    marginBottom: 12,
    display: "block",
  };

  return (
    <div style={{ minHeight: "100svh", background: "#f0f1f8", display: "flex", flexDirection: "column", paddingBottom: 88 }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(160deg, #3730a3 0%, #4f46e5 100%)", padding: "56px 20px 24px" }}>
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", cursor: "pointer", flexShrink: 0,
            }}
          >
            <ArrowLeft size={17} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#fff", letterSpacing: "-0.2px" }}>
            Trasferisci fondi
          </span>
        </div>

        {/* balance pill */}
        <div style={{
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 18,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(199,210,254,0.85)", letterSpacing: "1.4px", textTransform: "uppercase", marginBottom: 4 }}>
              Saldo disponibile
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>
              ${balance}
            </p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8, padding: "5px 12px",
          }}>
            Portafoglio
          </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, padding: "16px 16px 0" }}>

        {/* success */}
        {success && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 12, padding: "10px 14px", marginBottom: 12,
          }}>
            <CheckCircle size={15} color="#16a34a" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>{success}</span>
          </div>
        )}

        {/* ── FIND RECIPIENT ── */}
        <div style={card}>
          <span style={sectionLabel}>Trova destinatario</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Cerca per nome..."
              style={{
                flex: 1, height: 44, borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                padding: "0 14px",
                fontSize: 14, color: "#111827",
                outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                width: 44, height: 44, flexShrink: 0,
                borderRadius: 12, background: "#4f46e5",
                border: "none", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#fff", cursor: "pointer",
              }}
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </div>

          {searching && (
            <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", fontWeight: 500, marginTop: 14 }}>
              Ricerca in corso...
            </p>
          )}

          {searched && !searching && users.length === 0 && (
            <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", fontWeight: 500, marginTop: 14 }}>
              Nessun utente trovato
            </p>
          )}

          {users.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {users.map((u) => {
                const isSelected = selected?.uid === u.uid;
                return (
                  <div
                    key={u.uid}
                    onClick={() => setSelected(u)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 12px", borderRadius: 14, cursor: "pointer",
                      border: isSelected ? "1.5px solid #6366f1" : "1px solid #f1f2f6",
                      background: isSelected ? "#eef2ff" : "#f9fafb",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: isSelected ? "#4f46e5" : "#eef2ff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700,
                      color: isSelected ? "#fff" : "#4f46e5",
                      flexShrink: 0,
                    }}>
                      {u.fullName[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.3 }}>
                        {u.fullName}
                      </p>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.email}
                      </p>
                    </div>
                    {isSelected && <CheckCircle size={16} color="#6366f1" style={{ flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── AMOUNT ── */}
        <div style={card}>
          <span style={sectionLabel}>Amount</span>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 16, top: "50%",
              transform: "translateY(-50%)",
              fontSize: 22, fontWeight: 700, color: "#6366f1",
              pointerEvents: "none",
            }}>
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: "100%", boxSizing: "border-box",
                height: 64, paddingLeft: 38, paddingRight: 16,
                borderRadius: 14, border: "1px solid #e5e7eb",
                background: "#f9fafb",
                fontSize: 28, fontWeight: 700,
                color: "#111827", letterSpacing: "-0.5px",
                outline: "none", fontFamily: "inherit",
              }}
            />
          </div>

          {/* quick amounts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
            {QUICK_AMOUNTS.map((q) => {
              const active = amount === String(q);
              return (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  style={{
                    height: 36, borderRadius: 10,
                    border: active ? "1.5px solid #6366f1" : "1px solid #e5e7eb",
                    background: active ? "#eef2ff" : "#f9fafb",
                    fontSize: 13, fontWeight: 600,
                    color: active ? "#4f46e5" : "#6b7280",
                    cursor: "pointer", transition: "all 0.12s",
                    fontFamily: "inherit",
                  }}
                >
                  ${q}
                </button>
              );
            })}
          </div>
        </div>

        {/* error */}
        {error && (
          <p style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", textAlign: "center", marginBottom: 12 }}>
            {error}
          </p>
        )}

        {/* send button */}
        <button
          onClick={handleTransfer}
          style={{
            width: "100%", height: 52, borderRadius: 16,
            background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            border: "none", color: "#fff",
            fontSize: 15, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, cursor: "pointer", fontFamily: "inherit",
            letterSpacing: "-0.2px",
          }}
        >
          <Send size={16} />
          Send money
        </button>
      </div>

      {/* ── CONFIRM SHEET ── */}
      {showConfirm && (
        <div
          onClick={() => !loading && setShowConfirm(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(10,10,30,0.5)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              width: "100%", maxWidth: 480,
              padding: "20px 20px 40px",
            }}
          >
            {/* handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e5e7eb", margin: "0 auto 20px" }} />

            {/* recipient avatar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#eef2ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 700, color: "#4f46e5",
                marginBottom: 8,
              }}>
                {selected?.fullName?.[0]}
              </div>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                Sending to <strong style={{ color: "#111827" }}>{selected?.fullName}</strong>
              </p>
            </div>

            <p style={{ fontSize: 42, fontWeight: 700, color: "#111827", letterSpacing: "-1px", textAlign: "center", margin: "0 0 20px" }}>
              ${parseFloat(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>

            {/* details */}
            <div style={{ borderTop: "1px solid #f3f4f6", marginBottom: 16 }}>
              {[
                { label: "From", value: "My wallet" },
                { label: "Fee", value: "$0.00" },
                { label: "Arrives", value: "Instantly" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: "1px solid #f3f4f6",
                }}>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                style={{
                  flex: 1, height: 50, borderRadius: 14,
                  border: "1px solid #e5e7eb", background: "#f9fafb",
                  fontSize: 14, fontWeight: 600, color: "#6b7280",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Annulla
              </button>
              <button
                onClick={confirmTransfer}
                disabled={loading}
                style={{
                  flex: 2, height: 50, borderRadius: 14,
                  background: loading ? "#a5b4fc" : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                  border: "none",
                  fontSize: 14, fontWeight: 700, color: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", transition: "background 0.2s",
                }}
              >
                {loading ? "Elaborazione..." : "Conferma e invia"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Transfer;