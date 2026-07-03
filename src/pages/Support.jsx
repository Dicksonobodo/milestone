import { useEffect } from "react";
import BottomNav from "../components/ui/BottomNav";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  const openSmartsupp = () => {
    try {
      if (typeof window.smartsupp === "function") {
        window.smartsupp("chat:open");
        return;
      }
      if (window._smartsupp && typeof window._smartsupp === "object" && typeof window._smartsupp.open === "function") {
        window._smartsupp.open();
        return;
      }
    } catch (e) {
      // ignore
    }
    window.open("https://www.smartsuppchat.com", "_blank");
  };

  useEffect(() => {
    // optionally auto-open chat when user lands on Support page
    // openSmartsupp();
  }, []);

  return (
    <div style={{ minHeight: "100svh", background: "#f0f1f8", display: "flex", flexDirection: "column", paddingBottom: 88 }}>
      <div style={{ background: "linear-gradient(160deg, #3730a3 0%, #4f46e5 100%)", padding: "52px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>
                Milestone Support
              </p>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#6ee7b7", margin: 0, letterSpacing: "0.2px" }}>
                Chat with our team via Smartsupp
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 560, textAlign: "center", background: "#fff", padding: 28, borderRadius: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>Need help?</h2>
          <p style={{ margin: 0, marginBottom: 18, color: "#6b7280" }}>We use Smartsupp for live chat support. Use the chat widget at the bottom-right, or click the button below to open the Smartsupp chat.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={openSmartsupp} style={{ padding: "10px 16px", borderRadius: 10, background: "#4f46e5", color: "#fff", border: "none", cursor: "pointer" }}>Open Chat</button>
            <a href="https://www.smartsuppchat.com" target="_blank" rel="noreferrer" style={{ padding: "10px 16px", borderRadius: 10, background: "#fff", color: "#4f46e5", border: "1px solid #e8eaf0", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Smartsupp website</a>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Support;