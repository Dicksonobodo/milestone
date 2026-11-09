import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Plus,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import BankCard from "../components/dashboard/BankCard";
import TransactionItem from "../components/dashboard/TransactionItem";
import BalanceChart from "../components/dashboard/BalanceChart";
import BottomNav from "../components/ui/BottomNav";

const formatCurrency = (value) =>
  `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const getDate = (value) => {
  if (!value) return null;
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const categoryIcon = (description = "") => {
  const name = description.toLowerCase();
  if (/food|restaurant|grocery|cibo/.test(name)) return Utensils;
  if (/shop|store|shopping|acquisto/.test(name)) return ShoppingBag;
  if (/transfer|trasfer/.test(name)) return ArrowUpRight;
  if (/withdraw|preliev/.test(name)) return ArrowDownLeft;
  if (/invest/.test(name)) return TrendingUp;
  return CreditCard;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { transactions, loading, error } = useUser();

  const spending = useMemo(() => {
    const now = new Date();
    const categories = new Map();
    let monthlyTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type !== "debit") return;
      const amount = Number(transaction.amount);
      if (!Number.isFinite(amount)) return;

      const date = getDate(transaction.date);
      if (date && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
        monthlyTotal += amount;
      }

      const label = transaction.description || "Altro";
      categories.set(label, (categories.get(label) || 0) + amount);
    });

    return {
      monthlyTotal,
      categories: [...categories.entries()]
        .map(([label, amount]) => ({ label, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3),
    };
  }, [transactions]);

  const firstName = userData?.fullName?.trim().split(/\s+/)[0] || "Utente";

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <div className="dashboard-hero__inner">
          <div className="dashboard-heading">
            <div>
              <p className="dashboard-eyebrow">IL TUO CONTO, A COLPO D'OCCHIO</p>
              <h1>Ciao, {firstName}</h1>
              <p className="dashboard-subtitle">Ecco un riepilogo delle tue finanze.</p>
            </div>
            <div className="dashboard-heading__actions">
              <button
                className="icon-button"
                onClick={() => navigate("/transfer")}
                aria-label="Avvia un nuovo trasferimento"
              >
                <Plus size={19} />
              </button>
              <button
                className="profile-avatar"
                onClick={() => navigate("/profile")}
                aria-label="Apri il profilo"
              >
                {userData?.fullName?.[0]?.toUpperCase() || "U"}
              </button>
            </div>
          </div>

          <BankCard balance={userData?.balance || 0} cardNumber={userData?.cardNumber || "3245"} />

          <div className="dashboard-actions">
            <button className="primary-action" onClick={() => navigate("/transfer")}>
              <ArrowUpRight size={17} />
              Invia denaro
            </button>
            <button className="secondary-action" onClick={() => navigate("/withdraw")}>
              <ArrowDownLeft size={17} />
              Ritira fondi
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {error && <p className="inline-error" role="alert">{error}</p>}

        <div className="dashboard-grid">
          <section className="dashboard-panel spending-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-eyebrow">ANALISI</p>
                <h2>Andamento spese</h2>
              </div>
              <span className="panel-period">Ultimi 6 mesi</span>
            </div>

            <div className="spending-total">
              <div>
                <p>Spese di questo mese</p>
                <strong>{formatCurrency(spending.monthlyTotal)}</strong>
              </div>
              <span className="spending-total__icon"><TrendingUp size={19} /></span>
            </div>

            {loading ? (
              <div className="chart-empty">Caricamento attività…</div>
            ) : (
              <BalanceChart transactions={transactions} />
            )}

            <div className="category-heading">
              <h3>Spese per categoria</h3>
              <span>Attività registrate</span>
            </div>
            {spending.categories.length ? (
              <div className="category-list">
                {spending.categories.map(({ label, amount }) => {
                  const Icon = categoryIcon(label);
                  return (
                    <div className="category-item" key={label}>
                      <span className="category-item__icon"><Icon size={17} /></span>
                      <span className="category-item__name">{label}</span>
                      <strong>{formatCurrency(amount)}</strong>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="category-empty">Le categorie compariranno dopo la prima spesa.</p>
            )}
          </section>

          <section className="dashboard-panel transactions-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-eyebrow">ATTIVITÀ RECENTE</p>
                <h2>Transazioni</h2>
              </div>
              <button className="text-button" onClick={() => navigate("/transactions")}>
                Cronologia
              </button>
            </div>

            {loading ? (
              <div className="transactions-empty">Caricamento transazioni…</div>
            ) : error ? (
              <div className="transactions-empty">Non è stato possibile recuperare le transazioni.</div>
            ) : transactions.length === 0 ? (
              <div className="transactions-empty">
                <span className="empty-icon"><Receipt size={20} /></span>
                <strong>Nessuna transazione</strong>
                <span>Quando ci sarà attività sul conto, la vedrai qui.</span>
              </div>
            ) : (
              <div className="recent-transactions">
                {transactions.slice(0, 5).map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            )}

            {!loading && transactions.length > 0 && (
              <button className="all-transactions-button" onClick={() => navigate("/transactions")}>
                <Receipt size={16} />
                Vedi tutti i movimenti
              </button>
            )}
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
