import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import BankCard from "../components/dashboard/BankCard";
import TransactionItem from "../components/dashboard/TransactionItem";
import BalanceChart from "../components/dashboard/BalanceChart";
import BottomNav from "../components/ui/BottomNav";
import { Plus, Plane, TrendingUp, Utensils } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { transactions, loading } = useUser();

  return (
    <div className="min-h-screen pb-24" style={{ background: "#f8f8fb" }}>

      {/* White header section */}
      <div style={{ background: "#fff", padding: "52px 20px 20px", borderRadius: "0 0 28px 28px" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#aaa", fontWeight: 500 }}>Bentornato</p>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1a1a2e", marginTop: "2px" }}>
              {userData?.fullName?.split(" ")[0] || "Utente"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f5f5f8", border: "none", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
              <Plus size={18} color="#555" />
              <span style={{ position: "absolute", top: "6px", right: "6px", width: "7px", height: "7px", background: "#ff6b35", borderRadius: "50%", border: "1.5px solid #f5f5f8" }} />
            </button>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#5b5bd6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: 800 }}>
              {userData?.fullName?.[0] || "U"}
            </div>
          </div>
        </div>

        {/* Bank Card */}
        <BankCard balance={userData?.balance || 0} cardNumber={userData?.cardNumber || "3245"} />

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button
            onClick={() => navigate("/transfer")}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "14px", borderRadius: "14px", background: "#5b5bd6", color: "#fff", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
          >
            Trasferisci ➤
          </button>
          <button
            onClick={() => navigate("/withdraw")}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "14px", borderRadius: "14px", background: "#f5f5fb", color: "#5b5bd6", fontSize: "13px", fontWeight: 700, border: "1.5px solid #e8e8f8", cursor: "pointer" }}
          >
            Ritira ⊞
          </button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ margin: "16px", background: "#fff", borderRadius: "20px", padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#1a1a2e" }}>Marzo, 2023</span>
          <span style={{ fontSize: "11px", color: "#aaa", fontWeight: 600 }}>Mensile ▾</span>
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <button style={{ padding: "6px 14px", borderRadius: "20px", background: "#5b5bd6", color: "#fff", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}>Spese</button>
          <button style={{ padding: "6px 14px", borderRadius: "20px", background: "#f0f0f8", color: "#aaa", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}>Risparmi</button>
        </div>
        <BalanceChart transactions={transactions} />
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", overflowX: "auto", paddingBottom: "4px" }}>
          {[
            { icon: Plane, l: "Viaggio", a: "$0.00", color: "#FF9500" },
            { icon: TrendingUp, l: "Investimento", a: "$0.00", color: "#34C759" },
            { icon: Utensils, l: "Cibo", a: "$0.00", color: "#FF3B30" }
          ].map((c) => (
            <div key={c.l} style={{ flexShrink: 0, background: "#f8f8fb", borderRadius: "14px", padding: "10px 12px", minWidth: "82px" }}>
              <div style={{ marginBottom: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <c.icon size={20} color={c.color} strokeWidth={2} />
              </div>
              <div style={{ fontSize: "9px", color: "#aaa", fontWeight: 700 }}>{c.l}</div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#1a1a2e", marginTop: "1px" }}>{c.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ margin: "0 16px", background: "#fff", borderRadius: "20px", padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#1a1a2e" }}>Transazioni</span>
          <span style={{ fontSize: "11px", color: "#5b5bd6", fontWeight: 700, cursor: "pointer" }}>Vedi tutto</span>
        </div>
        {loading ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: "13px", padding: "24px 0" }}>Caricamento...</p>
        ) : transactions.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: "13px", padding: "24px 0" }}>Nessuna transazione ancora</p>
        ) : (
          transactions.slice(0, 5).map((txn) => <TransactionItem key={txn.id} transaction={txn} />)
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;