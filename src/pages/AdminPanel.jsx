import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FundUserForm from "../components/admin/FundUserForm";
import AdminSupport from "../components/admin/AdminSupport";
import { ArrowLeft, Users, MessageCircle, Shield } from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("fund");

  return (
    <div style={{ minHeight: "100svh", background: "#f0f1f8", paddingBottom: 40 }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(160deg, #3730a3 0%, #4f46e5 100%)", padding: "52px 20px 20px" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Shield size={17} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.2px" }}>Pannello admin</p>
              <p style={{ fontSize: 10, color: "rgba(199,210,254,0.8)", margin: 0, fontWeight: 500 }}>Milestone Bank</p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div style={{
          display: "flex", gap: 4,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 14, padding: 4,
        }}>
          {[
            { id: "fund", icon: Users, label: "Finanzia utenti" },
            { id: "support", icon: MessageCircle, label: "Supporto" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1, height: 40, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontSize: 13, fontWeight: 700,
                border: "none", cursor: "pointer",
                fontFamily: "inherit",
                background: tab === id ? "#fff" : "transparent",
                color: tab === id ? "#4f46e5" : "rgba(255,255,255,0.65)",
                transition: "all 0.15s",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "16px 16px 0" }}>
        {tab === "fund" && <FundUserForm />}
        {tab === "support" && <AdminSupport />}
      </div>
    </div>
  );
};

export default AdminPanel;