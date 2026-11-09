import { useLocation, useNavigate } from "react-router-dom";
import { Home, CreditCard, ArrowLeftRight, User, MessageCircle } from "lucide-react";

const tabs = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/transfer", icon: ArrowLeftRight, label: "Trasferisci" },
  { to: "/withdraw", icon: CreditCard, label: "Carte" },
  { to: "/support", icon: MessageCircle, label: "Supporto" },
  { to: "/profile", icon: User, label: "Profilo" },
];

const BottomNav = ({ unreadSupport = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav" aria-label="Navigazione principale">
      {tabs.map(({ to, icon: Icon, label }) => {
        const active =
          location.pathname === to ||
          (location.pathname === "/transactions" && to === "/dashboard");
        return (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`bottom-nav__item${active ? " is-active" : ""}`}
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            <div className="bottom-nav__icon">
              <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
              {label === "Supporto" && unreadSupport && (
                <span className="bottom-nav__badge" />
              )}
            </div>
            <span className="bottom-nav__label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;