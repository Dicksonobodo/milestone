import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top card area */}
      <div style={{ flex: 1, background: "#eef0fb", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", minHeight: "360px" }}>
        {/* Blobs */}
        {[
          { w: 100, h: 100, bg: "#7c7cee", t: -20, l: -20, blur: 30, op: .35 },
          { w: 70, h: 70, bg: "#9b8eee", t: 40, r: -10, blur: 20, op: .4 },
          { w: 130, h: 130, bg: "#7c7cee", b: -30, l: 30, blur: 35, op: .25 },
          { w: 60, h: 60, bg: "#5b5bd6", b: 30, r: 20, blur: 18, op: .3 },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute", width: b.w, height: b.h, borderRadius: "50%",
            background: b.bg, opacity: b.op, filter: `blur(${b.blur}px)`,
            top: b.t, left: b.l, bottom: b.b, right: b.r,
          }} />
        ))}

        {/* Cards */}
        <div style={{ position: "relative", width: "240px", height: "160px" }}>
          {/* Back card */}
          <div style={{
            position: "absolute", top: "20px", left: "18px", width: "210px", height: "130px",
            borderRadius: "18px", background: "linear-gradient(135deg, #ff8c42, #ffb347)",
            transform: "rotate(7deg)", padding: "14px", boxShadow: "0 12px 40px rgba(255,140,66,.35)"
          }}>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,.5)", letterSpacing: "2px", marginTop: "30px" }}>
              •••• •••• •••• 8821
            </div>
            <div style={{ marginTop: "8px" }}>
              <div style={{ fontSize: "8px", color: "rgba(255,255,255,.5)" }}>Balance</div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>$ 8,482.00</div>
            </div>
          </div>

          {/* Front card */}
          <div style={{
            position: "absolute", inset: 0, width: "210px", height: "130px",
            borderRadius: "18px", background: "linear-gradient(145deg, #5b5bd6 0%, #7c7cee 65%, #9b8eee 100%)",
            padding: "14px", boxShadow: "0 16px 48px rgba(91,91,214,.45)", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,.1)", top: "-30px", right: "-25px" }} />
            <div style={{ position: "absolute", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(255,255,255,.1)", bottom: "-25px", right: "10px" }} />
            <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: "28px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,.3)" }} />
                <div style={{ display: "flex" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#eb001b", opacity: .9 }} />
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#f79e1b", opacity: .9, marginLeft: "-9px" }} />
                </div>
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,.55)", letterSpacing: "3px" }}>•••• •••• •••• 3245</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Balance</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>$ 8,482.00</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Valid thru</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,.75)" }}>08/30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ background: "#fff", padding: "28px 22px 40px", borderRadius: "32px 32px 0 0", marginTop: "-20px", boxShadow: "0 -8px 40px rgba(0,0,0,.06)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1a1a2e", lineHeight: 1.3, marginBottom: "8px" }}>
          Soluzione sostenibile<br />per il futuro
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.65, marginBottom: "24px" }}>
          Con le funzioni di sicurezza online ora<br />i tuoi soldi saranno al sicuro
        </p>
        <button
          onClick={() => navigate("/register")}
          style={{ width: "100%", padding: "16px", borderRadius: "16px", background: "#5b5bd6", color: "#fff", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}
        >
          Inizia
        </button>
        <p style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "#9ca3af" }}>
          Hai già un account?{" "}
          <span onClick={() => navigate("/login")} style={{ color: "#5b5bd6", fontWeight: 700, cursor: "pointer" }}>Accedi</span>
        </p>
      </div>
    </div>
  );
};

export default Splash;