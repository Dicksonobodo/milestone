import { useState } from "react";
import { getAllUsers, fundUserAccount, upgradeToTier2, deleteUserDoc } from "../../firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { Search, CheckCircle, ChevronDown, ArrowUpCircle, Users, Trash2, AlertTriangle } from "lucide-react";

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

const FundUserForm = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUid, setSelectedUid] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const card = {
    background: "#fff", borderRadius: 20,
    border: "1px solid #e8eaf0", padding: "18px 16px",
    marginBottom: 12,
  };
  const label = {
    fontSize: 10, fontWeight: 600, color: "#9ca3af",
    letterSpacing: "1.4px", textTransform: "uppercase",
    display: "block", marginBottom: 8,
  };

  const fetchUsers = async () => {
    setFetching(true);
    const all = await getAllUsers();
    setUsers(all.filter((u) => u.role !== "admin"));
    setFetching(false);
  };

  const handleFund = async () => {
    if (!selectedUid) return setError("Please select a user.");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return setError("Enter a valid amount.");
    setError("");
    setLoading(true);
    await fundUserAccount(selectedUid, Number(amount), currentUser.uid);
    const user = users.find((u) => u.uid === selectedUid);
    setSuccess(`$${Number(amount).toLocaleString()} funded to ${user?.fullName}!`);
    setAmount("");
    setSelectedUid("");
    setLoading(false);
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleUpgradeTier = async () => {
    if (!selectedUid) return setError("Please select a user first.");
    setError("");
    setUpgrading(true);
    await upgradeToTier2(selectedUid);
    const user = users.find((u) => u.uid === selectedUid);
    setSuccess(`${user?.fullName} upgraded to Tier 2!`);
    // update local state so badge reflects immediately
    setUsers((prev) => prev.map((u) => u.uid === selectedUid ? { ...u, tier: 2 } : u));
    setUpgrading(false);
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleDeleteUser = async () => {
    setDeleting(true);
    const user = users.find((u) => u.uid === selectedUid);
    await deleteUserDoc(selectedUid);
    setUsers((prev) => prev.filter((u) => u.uid !== selectedUid));
    setSelectedUid("");
    setShowDeleteConfirm(false);
    setDeleting(false);
    setSuccess(`${user?.fullName}'s account removed.`);
    setTimeout(() => setSuccess(""), 4000);
  };

  // ── empty state ────────────────────────────────────────────────────────────
  if (users.length === 0) {
    return (
      <div style={{ ...card, textAlign: "center", padding: "40px 20px" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: "#eef2ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px",
        }}>
          <Users size={24} color="#4f46e5" />
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Load users</p>
        <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 20px", lineHeight: 1.6 }}>
          Fetch all user accounts to fund, upgrade, or remove them
        </p>
        <button
          onClick={fetchUsers}
          disabled={fetching}
          style={{
            height: 44, paddingLeft: 20, paddingRight: 20, borderRadius: 12,
            background: fetching ? "#a5b4fc" : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            border: "none", color: "#fff", fontSize: 14, fontWeight: 700,
            display: "inline-flex", alignItems: "center", gap: 7,
            cursor: fetching ? "not-allowed" : "pointer", fontFamily: "inherit",
          }}
        >
          <Search size={15} />
          {fetching ? "Loading..." : "Load users"}
        </button>
      </div>
    );
  }

  const selectedUser = users.find((u) => u.uid === selectedUid);

  return (
    <div>

      {/* ── USER SELECT ── */}
      <div style={card}>
        <span style={label}>Select user</span>
        <div style={{ position: "relative" }}>
          <select
            value={selectedUid}
            onChange={(e) => { setSelectedUid(e.target.value); setShowDeleteConfirm(false); setError(""); }}
            style={{
              width: "100%", boxSizing: "border-box",
              height: 48, borderRadius: 12,
              border: "1px solid #e5e7eb", background: "#f9fafb",
              padding: "0 40px 0 14px",
              fontSize: 14, fontWeight: 500,
              color: selectedUid ? "#111827" : "#9ca3af",
              outline: "none", fontFamily: "inherit",
              appearance: "none", cursor: "pointer",
            }}
          >
            <option value="">Choose a user...</option>
            {users.map((u) => (
              <option key={u.uid} value={u.uid}>
                {u.fullName} — ${Number(u.balance || 0).toLocaleString()} · Tier {u.tier || 1}
              </option>
            ))}
          </select>
          <ChevronDown size={16} color="#9ca3af" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>

        {/* selected user info pill */}
        {selectedUser && (
          <div style={{
            marginTop: 10, padding: "10px 14px",
            background: "#f9fafb", borderRadius: 12, border: "1px solid #e8eaf0",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "#eef2ff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#4f46e5", flexShrink: 0,
            }}>
              {selectedUser.fullName[0]}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{selectedUser.fullName}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{selectedUser.email}</p>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
              background: selectedUser.tier === 2 ? "#dcfce7" : "#fff7ed",
              color: selectedUser.tier === 2 ? "#16a34a" : "#d97706",
            }}>
              Tier {selectedUser.tier || 1}
            </div>
          </div>
        )}
      </div>

      {/* ── AMOUNT ── */}
      <div style={card}>
        <span style={label}>Amount to fund</span>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 20, fontWeight: 700, color: "#6366f1", pointerEvents: "none",
          }}>$</span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              height: 56, borderRadius: 12,
              border: "1px solid #e5e7eb", background: "#f9fafb",
              paddingLeft: 36, paddingRight: 16,
              fontSize: 22, fontWeight: 700, color: "#111827",
              outline: "none", fontFamily: "inherit", letterSpacing: "-0.3px",
            }}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {QUICK_AMOUNTS.map((q) => {
            const active = amount === String(q);
            return (
              <button key={q} onClick={() => setAmount(String(q))} style={{
                height: 34, borderRadius: 10,
                border: active ? "1.5px solid #6366f1" : "1px solid #e5e7eb",
                background: active ? "#eef2ff" : "#f9fafb",
                fontSize: 12, fontWeight: 600,
                color: active ? "#4f46e5" : "#6b7280",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                ${q >= 1000 ? `${q / 1000}k` : q}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ERROR / SUCCESS ── */}
      {error && (
        <p style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", textAlign: "center", marginBottom: 12 }}>{error}</p>
      )}
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

      {/* ── FUND BUTTON ── */}
      <button
        onClick={handleFund}
        disabled={loading}
        style={{
          width: "100%", height: 52, borderRadius: 16, marginBottom: 10,
          background: loading ? "#a5b4fc" : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit", letterSpacing: "-0.2px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}
      >
        {loading ? "Processing..." : "Fund account"}
      </button>

      {/* ── UPGRADE TIER BUTTON ── */}
      <button
        onClick={handleUpgradeTier}
        disabled={upgrading || selectedUser?.tier === 2}
        style={{
          width: "100%", height: 48, borderRadius: 16, marginBottom: 10,
          background: selectedUser?.tier === 2 ? "#f0fdf4" : "#f9fafb",
          border: `1px solid ${selectedUser?.tier === 2 ? "#bbf7d0" : "#e5e7eb"}`,
          color: selectedUser?.tier === 2 ? "#16a34a" : "#374151",
          fontSize: 14, fontWeight: 600,
          cursor: selectedUser?.tier === 2 || upgrading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          opacity: upgrading ? 0.6 : 1,
        }}
      >
        <ArrowUpCircle size={16} color={selectedUser?.tier === 2 ? "#16a34a" : "#6b7280"} />
        {selectedUser?.tier === 2 ? "Already Tier 2" : upgrading ? "Upgrading..." : "Upgrade to Tier 2"}
      </button>

      {/* ── DELETE USER ── */}
      {!showDeleteConfirm ? (
        <button
          onClick={() => { if (!selectedUid) return setError("Please select a user first."); setShowDeleteConfirm(true); }}
          style={{
            width: "100%", height: 48, borderRadius: 16,
            background: "#fff1f2", border: "1px solid #fecdd3",
            color: "#e11d48", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          }}
        >
          <Trash2 size={16} />
          Delete user account
        </button>
      ) : (
        /* ── DELETE CONFIRM INLINE ── */
        <div style={{
          background: "#fff1f2", border: "1px solid #fecdd3",
          borderRadius: 16, padding: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "#ffe4e6",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <AlertTriangle size={18} color="#e11d48" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#e11d48", margin: 0 }}>Delete this account?</p>
              <p style={{ fontSize: 11, color: "#f43f5e", margin: 0 }}>
                This removes <strong>{selectedUser?.fullName}</strong>'s Firestore data permanently.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                flex: 1, height: 42, borderRadius: 12,
                border: "1px solid #fecdd3", background: "#fff",
                fontSize: 13, fontWeight: 600, color: "#6b7280",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={deleting}
              style={{
                flex: 2, height: 42, borderRadius: 12,
                background: deleting ? "#fda4af" : "linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)",
                border: "none", fontSize: 13, fontWeight: 700, color: "#fff",
                cursor: deleting ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundUserForm;