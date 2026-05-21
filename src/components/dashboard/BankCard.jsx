const BankCard = ({ balance = 0, cardNumber = "3245", validThru = "08/30" }) => (
  <div style={{
    width: "100%", height: "160px", borderRadius: "22px",
    background: "linear-gradient(145deg, #5b5bd6 0%, #7c7cee 65%, #9b8eee 100%)",
    padding: "18px", position: "relative", overflow: "hidden",
    boxShadow: "0 14px 44px rgba(91,91,214,.38)"
  }}>
    {/* Circles */}
    <div style={{ position: "absolute", width: "130px", height: "130px", borderRadius: "50%", background: "rgba(255,255,255,.09)", top: "-40px", right: "-28px" }} />
    <div style={{ position: "absolute", width: "90px", height: "90px", borderRadius: "50%", background: "rgba(255,255,255,.09)", bottom: "-32px", right: "18px" }} />

    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      {/* Top: dots + mastercard */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          <div style={{ width: "14px", height: "5px", borderRadius: "3px", background: "#fff" }} />
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,.4)" }} />
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,.4)" }} />
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#eb001b", opacity: .9 }} />
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#f79e1b", opacity: .9, marginLeft: "-9px" }} />
        </div>
      </div>

      {/* Card number */}
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,.55)", letterSpacing: "3px" }}>
        •  •  •  •  &nbsp;&nbsp; {cardNumber}
      </div>

      {/* Bottom: balance + valid */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,.5)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "2px" }}>Balance</div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff" }}>
            $ {Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,.5)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "2px" }}>Valid thru</div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,.8)" }}>{validThru}</div>
        </div>
      </div>
    </div>
  </div>
);

export default BankCard;