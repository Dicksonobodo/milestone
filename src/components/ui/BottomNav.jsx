import { useLocation, useNavigate } from "react-router-dom";
import { Home, CreditCard, ArrowLeftRight,  User, MessageCircle } from "lucide-react";

const tabs = [
  { to: "/dashboard", icon: Home, label: "Home." },
  { to: "/transfer", icon: ArrowLeftRight, label: "Trasferisci" },
  { to: "/withdraw", icon: CreditCard, label: "Carte" },
  { to: "/support", icon: MessageCircle, label: "Supporto" },
  { to: "/profile", icon: User, label: "Profilo" },
];

const BottomNav = ({ unreadSupport = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
   <nav style={{
  position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
  width: "100%", maxWidth: "430px", background: "#fff",
  borderTop: "1px solid #f0f0f8", display: "flex", zIndex: 40,
  padding: "10px 56px 16px 0", boxSizing: "border-box"
}}>
      {tabs.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
          <button
            key={to}
            onClick={() => navigate(to)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: "3px", background: "none", border: "none", cursor: "pointer", padding: "0 4px"
            }}
          >
            <div style={{ position: "relative" }}>
              <Icon size={22} color={active ? "#5b5bd6" : "#d1d5db"} strokeWidth={active ? 2.5 : 1.8} />
              {label === "Supporto" && unreadSupport && (
                <span style={{ position: "absolute", top: 0, right: 0, width: "7px", height: "7px", background: "#ef4444", borderRadius: "50%", border: "1.5px solid #fff" }} />
              )}
            </div>
            {active
              ? <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5b5bd6" }} />
              : <span style={{ fontSize: "9px", fontWeight: 700, color: "#d1d5db" }}>{label}</span>
            }
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;