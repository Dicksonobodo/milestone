import { ShoppingBag, Wifi, ArrowDownToLine, ArrowUpFromLine, Building2, Utensils, CreditCard } from "lucide-react";

const iconMap = {
  Shopping: { icon: ShoppingBag, bg: "bg-orange-50", color: "text-orange-500" },
  "Wifi Bill": { icon: Wifi, bg: "bg-blue-50", color: "text-blue-500" },
  Withdrawal: { icon: ArrowDownToLine, bg: "bg-red-50", color: "text-red-500" },
  Transfer: { icon: ArrowUpFromLine, bg: "bg-purple-50", color: "text-purple-500" },
  "Admin Deposit": { icon: Building2, bg: "bg-emerald-50", color: "text-emerald-500" },
  Food: { icon: Utensils, bg: "bg-yellow-50", color: "text-yellow-600" },
  Default: { icon: CreditCard, bg: "bg-indigo-50", color: "text-indigo-500" },
};

const TransactionItem = ({ transaction }) => {
  const { description, amount, type, date } = transaction;
  const config = iconMap[description] || iconMap.Default;
  const Icon = config.icon;
  const isCredit = type === "credit";

  const formattedDate = date?.toDate
    ? date.toDate().toLocaleDateString("en-US", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl ${config.bg} flex items-center justify-center shrink-0`}>
          <Icon size={19} className={config.color} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{description}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{formattedDate}</p>
        </div>
      </div>
      <div className={`text-sm font-extrabold ${isCredit ? "text-emerald-500" : "text-red-400"}`}>
        {isCredit ? "+" : "−"}${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default TransactionItem;