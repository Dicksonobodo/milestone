import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSupport = () => {
  const navigate = useNavigate();

  const openDashboard = () => {
    // Open Smartsupp dashboard for admins
    window.open("https://app.smartsupp.com/", "_blank");
  };

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 8, background: "#f3f4f6", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Back">
          <ArrowLeft size={15} color="#6b7280" />
        </button>
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>Support (Smartsupp)</p>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Manage conversations via the Smartsupp dashboard.</p>
        </div>
      </div>

      <div style={{ background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e8eaf0" }}>
        <p style={{ marginTop: 0 }}>This app now uses Smartsupp for customer support. Open the Smartsupp dashboard to view and respond to chats.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={openDashboard} style={{ padding: "8px 12px", borderRadius: 8, background: "#4f46e5", color: "#fff", border: "none", cursor: "pointer" }}>Open Smartsupp Dashboard</button>
          <a href="https://www.smartsuppchat.com" target="_blank" rel="noreferrer" style={{ padding: "8px 12px", borderRadius: 8, background: "#fff", color: "#4f46e5", border: "1px solid #e8eaf0", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Smartsupp site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;