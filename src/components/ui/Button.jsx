const Button = ({ children, onClick, variant = "primary", className = "", disabled = false, type = "button" }) => {
  const base = "w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200",
    secondary: "bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50",
    danger: "bg-gradient-to-r from-red-500 to-red-400 text-white shadow-lg shadow-red-100",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-100",
    dark: "bg-gray-900 text-white hover:bg-gray-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;