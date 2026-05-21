import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg font-bold">
        ${payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

const defaultData = [
  { name: "Jan", value: 1200 }, { name: "Feb", value: 980 },
  { name: "Mar", value: 1860 }, { name: "Apr", value: 1400 },
  { name: "May", value: 1650 }, { name: "Jun", value: 1300 },
];

const BalanceChart = ({ transactions = [] }) => {
  const data = transactions.length
    ? [...transactions].reverse().slice(0, 6).map((t, i) => ({ name: `T${i + 1}`, value: t.amount }))
    : defaultData;

  return (
    <div className="w-full h-32">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "Plus Jakarta Sans", fontWeight: 600 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#grad)" dot={false} activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;