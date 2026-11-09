import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import BottomNav from "../components/ui/BottomNav";
import TransactionItem from "../components/dashboard/TransactionItem";
import { useUser } from "../hooks/useUser";

const formatCurrency = (value) =>
  `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const filters = [
  { value: "all", label: "Tutte" },
  { value: "credit", label: "Entrate" },
  { value: "debit", label: "Uscite" },
];

const Transactions = () => {
  const navigate = useNavigate();
  const {
    transactions,
    loading,
    error,
    hasMore,
    loadMore,
    loadingMore,
    paginationError,
  } = useUser();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const totals = useMemo(
    () =>
      transactions.reduce(
        (result, transaction) => {
          const amount = Number(transaction.amount);
          if (!Number.isFinite(amount)) return result;
          if (transaction.type === "credit") result.income += amount;
          if (transaction.type === "debit") result.expenses += amount;
          return result;
        },
        { income: 0, expenses: 0 },
      ),
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return transactions.filter((transaction) => {
      const matchesType = filter === "all" || transaction.type === filter;
      const matchesSearch = !term || (transaction.description || "").toLocaleLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }, [filter, query, transactions]);

  return (
    <div className="transactions-page">
      <header className="transactions-page__header">
        <button className="back-button" onClick={() => navigate("/dashboard")} aria-label="Torna alla dashboard">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="panel-eyebrow">IL TUO CONTO</p>
          <h1>Cronologia</h1>
          <p className="transactions-page__subtitle">Cerca e filtra i movimenti del tuo conto.</p>
        </div>
      </header>

      <main className="transactions-page__content">
        <section className="transaction-summary" aria-label="Riepilogo dei movimenti">
          <div className="transaction-summary__item">
            <span className="summary-icon summary-icon--income"><ArrowDownLeft size={17} /></span>
            <div><span>Entrate caricate</span><strong>{formatCurrency(totals.income)}</strong></div>
          </div>
          <div className="transaction-summary__item">
            <span className="summary-icon summary-icon--expense"><ArrowUpRight size={17} /></span>
            <div><span>Uscite caricate</span><strong>{formatCurrency(totals.expenses)}</strong></div>
          </div>
        </section>

        <section className="transaction-history">
          <div className="transaction-history__heading">
            <div>
              <p className="panel-eyebrow">MOVIMENTI</p>
              <h2>Attività recente</h2>
            </div>
            <span className="transaction-count">{transactions.length} caricati</span>
          </div>

          <label className="transaction-search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca per descrizione"
              aria-label="Cerca transazioni per descrizione"
            />
          </label>

          <div className="transaction-filters" aria-label="Filtra transazioni">
            {filters.map(({ value, label }) => (
              <button
                key={value}
                className={`filter-chip${filter === value ? " is-active" : ""}`}
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="history-state" role="status">Caricamento transazioni…</p>
          ) : error ? (
            <p className="history-state history-state--error" role="alert">{error}</p>
          ) : filteredTransactions.length ? (
            <div className="history-list">
              {filteredTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="history-state">
              <strong>{transactions.length ? "Nessun risultato" : "Non ci sono ancora movimenti"}</strong>
              <span>
                {transactions.length
                  ? "Prova un altro termine o cambia il filtro."
                  : "Le tue transazioni recenti appariranno in questa pagina."}
              </span>
            </div>
          )}

          {paginationError && <p className="history-state--error" role="alert">{paginationError}</p>}
          {hasMore && !loading && !error && (
            <button className="load-more-button" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? "Caricamento…" : "Carica altri movimenti"}
            </button>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Transactions;
