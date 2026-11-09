import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const formatCurrency = (value) =>
  `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const getDate = (value) => {
  if (!value) return null;
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      {formatCurrency(payload[0].value)}
    </div>
  );
};

const BalanceChart = ({ transactions = [] }) => {
  const now = new Date();
  const data = Array.from({ length: 6 }, (_, index) => {
    const month = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    return {
      key: `${month.getFullYear()}-${month.getMonth()}`,
      name: new Intl.DateTimeFormat("it-IT", { month: "short" }).format(month),
      value: 0,
    };
  });
  const months = new Map(data.map((month) => [month.key, month]));

  transactions.forEach((transaction) => {
    if (transaction.type !== "debit") return;
    const date = getDate(transaction.date);
    const amount = Number(transaction.amount);
    if (!date || !Number.isFinite(amount)) return;

    const month = months.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (month) month.value += amount;
  });

  const hasSpending = data.some((month) => month.value > 0);

  if (!hasSpending) {
    return (
      <div className="chart-empty">
        <p>Le spese registrate negli ultimi sei mesi appariranno qui.</p>
      </div>
    );
  }

  return (
    <div className="balance-chart" role="img" aria-label="Spese mensili degli ultimi sei mesi">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="spending-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5b5bd6" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#5b5bd6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9296aa", fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#5b5bd6"
            strokeWidth={2.5}
            fill="url(#spending-gradient)"
            dot={false}
            activeDot={{ r: 5, fill: "#5b5bd6", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;
