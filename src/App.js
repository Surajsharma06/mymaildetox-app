import { useState, useEffect } from "react";

const SUBS = [
  { id:1,  sender:"Zomato",          email:"noreply@zomato.com",    count:47,  category:"PROMO",      last:"2 hours ago" },
  { id:2,  sender:"Swiggy Offers",   email:"offers@swiggy.in",      count:89,  category:"PROMO",      last:"Yesterday"   },
  { id:3,  sender:"Medium Daily",    email:"digest@medium.com",     count:124, category:"NEWSLETTER", last:"3 days ago"  },
  { id:4,  sender:"LinkedIn Jobs",   email:"jobs@linkedin.com",     count:203, category:"NEWSLETTER", last:"1 day ago"   },
  { id:5,  sender:"Amazon Deals",    email:"deals@amazon.in",       count:312, category:"PROMO",      last:"5 hours ago" },
  { id:6,  sender:"Flipkart Sale",   email:"sale@flipkart.com",     count:178, category:"PROMO",      last:"Today"       },
  { id:7,  sender:"Coursera Weekly", email:"weekly@coursera.org",   count:56,  category:"NEWSLETTER", last:"1 week ago"  },
  { id:8,  sender:"MakeMyTrip",      email:"offers@makemytrip.com", count:91,  category:"PROMO",      last:"2 days ago"  },
  { id:9,  sender:"GitHub Digest",   email:"noreply@github.com",    count:34,  category:"NEWSLETTER", last:"4 days ago"  },
  { id:10, sender:"Paytm Cashback",  email:"cashback@paytm.com",    count:267, category:"PROMO",      last:"6 hours ago" },
  { id:11, sender:"Udemy Deals",     email:"deals@udemy.com",       count:145, category:"PROMO",      last:"3 days ago"  },
  { id:12, sender:"Nykaa Beauty",    email:"beauty@nykaa.com",      count:88,  category:"PROMO",      last:"Yesterday"   },
];

const CAT_STYLE = {
  PROMO:      { bg:"#F5F5F5", text:"#888", border:"#E5E5E5", dot:"#F4A261" },
  NEWSLETTER: { bg:"#F5F5F5", text:"#888", border:"#E5E5E5", dot:"#74C0FC" },
  SPAM:       { bg:"#F5F5F5", text:"#888", border:"#E5E5E5", dot:"#F03E3E" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #fff; color: #37352f; }

  @keyframes fadeIn  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }
  @keyframes popIn   { 0% { transform:scale(.95); opacity:0; } 100% { transform:scale(1); opacity:1; } }
  @keyframes shimmer { 0%,100% { opacity:.5; } 50% { opacity:1; } }
  @keyframes progress { from { width:0%; } }

  .fade { animation: fadeIn .3s ease both; }
  .s1 { animation-delay: .04s; }
  .s2 { animation-delay: .08s; }
  .s3 { animation-delay: .12s; }
  .s4 { animation-delay: .16s; }
  .s5 { animation-delay: .20s; }
  .s6 { animation-delay: .24s; }

  /* Notion-style hover */
  .n-hover { transition: background .12s ease; border-radius: 6px; }
  .n-hover:hover { background: rgba(55,53,47,.06); }

  /* Sub rows */
  .sub-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: 6px;
    cursor: pointer; transition: background .12s ease;
    animation: slideIn .25s ease both;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .sub-row:hover { background: rgba(55,53,47,.05); }
  .sub-row.sel   { background: #F7F6F3; }
  .sub-row:active { background: rgba(55,53,47,.08); }

  /* Checkbox — Notion style */
  .chk {
    width: 18px; height: 18px; border-radius: 4px; flex-shrink: 0;
    border: 1.5px solid #C7C6C4; background: #fff;
    display: flex; align-items: center; justify-content: center;
    transition: all .12s ease;
  }
  .chk.on { background: #2383E2; border-color: #2383E2; }

  /* Filter tabs */
  .f-tab {
    padding: 4px 10px; border-radius: 5px; border: none; background: transparent;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: #9B9A97; cursor: pointer; transition: all .12s ease;
    white-space: nowrap; -webkit-tap-highlight-color: transparent;
  }
  .f-tab:hover { background: rgba(55,53,47,.06); color: #37352f; }
  .f-tab.on    { background: rgba(55,53,47,.08); color: #37352f; }

  /* CTA button */
  .cta {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 10px 16px;
    background: #2383E2; color: #fff;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
    border: none; border-radius: 6px; cursor: pointer;
    transition: background .15s ease, transform .1s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .cta:hover  { background: #1A73D4; }
  .cta:active { transform: scale(.99); }

  /* Unsub button */
  .unsub {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    width: 100%; padding: 9px 16px;
    background: #EB5757; color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: none; border-radius: 6px; cursor: pointer;
    transition: background .15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .unsub:hover:not(:disabled) { background: #D44C4C; }
  .unsub:disabled { background: #E5E5E5; color: #AAA; cursor: not-allowed; }

  /* Search */
  .search {
    width: 100%; padding: 7px 10px 7px 34px;
    background: #F7F6F3; border: 1px solid #E9E9E7;
    border-radius: 6px; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 400; color: #37352f;
    outline: none; transition: border-color .15s, background .15s;
  }
  .search::placeholder { color: #9B9A97; }
  .search:focus { background: #fff; border-color: #2383E2; }

  /* Divider */
  .divider { height: 1px; background: #E9E9E7; margin: 0; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #D3D3D1; border-radius: 3px; }

  /* Mobile */
  @media (max-width: 480px) {
    .hide-mobile { display: none !important; }
    .hero-title  { font-size: 28px !important; letter-spacing: -.5px !important; }
    .hero-sub    { font-size: 14px !important; }
    .stat-num    { font-size: 20px !important; }
    .stat-lbl    { font-size: 10px !important; }
    .page-title  { font-size: 20px !important; }
    .f-tab       { font-size: 12px !important; padding: 4px 8px !important; }
  }
`;

/* ── Notion-style Logo ── */
function Logo({ size = 32 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#37352F"/>
      {/* Envelope */}
      <rect x="5" y="10" width="22" height="14" rx="2.5" fill="white" fillOpacity=".9"/>
      <path d="M5 12.5L16 19L27 12.5" stroke="#37352F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {/* X — detox mark */}
      <path d="M19 19.5L21.5 22M21.5 19.5L19 22" stroke="#EB5757" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Sparkle */}
      <circle cx="24" cy="8" r="3.5" fill="#F4A261"/>
      <path d="M24 6.2V6.8M24 9.2V9.8M22.2 8H22.8M25.2 8H25.8" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Category Dot ── */
function Dot({ color }) {
  return <span style={{ width:8, height:8, borderRadius:"50%", background:color, display:"inline-block", flexShrink:0 }}/>;
}

export default function MyMailDetox() {
  const [screen, setScreen]       = useState("landing");
  const [subs, setSubs]           = useState(SUBS);
  const [selected, setSelected]   = useState([]);
  const [filter, setFilter]       = useState("ALL");
  const [scanning, setScanning]   = useState(false);
  const [scanPct, setScanPct]     = useState(0);
  const [unsubbing, setUnsubbing] = useState(false);
  const [unsubPct, setUnsubPct]   = useState(0);
  const [done, setDone]           = useState(false);
  const [query, setQuery]         = useState("");
  const [mobile, setMobile]       = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const startLogin = () => {
    setScanning(true); setScanPct(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 10 + 3;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => { setScanning(false); setScreen("dashboard"); }, 500); }
      setScanPct(Math.min(p, 100));
    }, 140);
  };

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const filtered = subs.filter(s =>
    (filter === "ALL" || s.category === filter) &&
    (s.sender.toLowerCase().includes(query.toLowerCase()) || s.email.toLowerCase().includes(query.toLowerCase()))
  );

  const allSel = filtered.length > 0 && filtered.every(s => selected.includes(s.id));
  const toggleAll = () => {
    const ids = filtered.map(s => s.id);
    if (allSel) setSelected(s => s.filter(x => !ids.includes(x)));
    else setSelected(s => [...new Set([...s, ...ids])]);
  };

  const doUnsub = () => {
    if (!selected.length) return;
    setUnsubbing(true); setUnsubPct(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        setTimeout(() => {
          setSubs(s => s.filter(x => !selected.includes(x.id)));
          setSelected([]); setUnsubbing(false); setDone(true);
          setTimeout(() => setDone(false), 3000);
        }, 300);
      }
      setUnsubPct(Math.min(p, 100));
    }, 90);
  };

  const total = subs.reduce((a, b) => a + b.count, 0);

  /* ═══════════════════════════ LANDING ══════════════════════════ */
  if (screen === "landing") return (
    <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter',sans-serif" }}>
      <style>{CSS}</style>

      {/* ── Topbar ── */}
      <div style={{ borderBottom:"1px solid #E9E9E7", padding: mobile?"12px 16px":"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:"#fff", zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <Logo size={mobile?28:32}/>
          <span style={{ fontSize: mobile?"16px":"17px", fontWeight:600, color:"#37352f", letterSpacing:"-.2px" }}>MyMailDetox</span>
        </div>
        {!mobile && (
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <button style={{ padding:"6px 14px", background:"transparent", border:"1px solid #E9E9E7", borderRadius:"6px", fontSize:"13px", fontWeight:500, color:"#37352f", cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"background .12s" }}
              onMouseEnter={e => e.target.style.background="#F7F6F3"}
              onMouseLeave={e => e.target.style.background="transparent"}
            >Log in</button>
            <button className="cta" onClick={startLogin} style={{ width:"auto", padding:"6px 16px", fontSize:"13px" }}>
              Get MyMailDetox free →
            </button>
          </div>
        )}
      </div>

      {/* ── Hero ── */}
      <div style={{ maxWidth:"680px", margin:"0 auto", padding: mobile?"48px 20px 60px":"80px 32px 80px" }}>

        {/* Tag */}
        <div className="fade s1" style={{ marginBottom:"20px" }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#F7F6F3", border:"1px solid #E9E9E7", borderRadius:"5px", padding:"4px 10px", fontSize:"12px", fontWeight:500, color:"#9B9A97" }}>
            📬 The inbox cleaner Unroll.me never built
          </span>
        </div>

        {/* Headline */}
        <h1 className="fade s2 hero-title" style={{ fontSize: mobile?"28px":"48px", fontWeight:700, color:"#37352f", lineHeight:1.12, letterSpacing: mobile?"-.5px":"-1.5px", marginBottom:"20px" }}>
          Your inbox.<br/>
          <span style={{ color:"#2383E2" }}>Finally clean.</span>
        </h1>

        <p className="fade s3 hero-sub" style={{ fontSize: mobile?"14px":"16px", color:"#6B6B6B", lineHeight:1.7, fontWeight:400, maxWidth:"520px", marginBottom:"32px" }}>
          100+ useless emails every day? Connect Gmail, see every subscription at a glance, and unsubscribe with one click. Like Notion — but for your inbox.
        </p>

        {/* CTA */}
        <div className="fade s4" style={{ maxWidth:"380px" }}>
          {scanning ? (
            <div style={{ background:"#F7F6F3", border:"1px solid #E9E9E7", borderRadius:"8px", padding:"20px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                <Logo size={24}/>
                <span style={{ fontSize:"14px", fontWeight:500, color:"#37352f" }}>Scanning Gmail...</span>
                <span style={{ marginLeft:"auto", fontSize:"13px", color:"#9B9A97" }}>{Math.round(scanPct)}%</span>
              </div>
              <div style={{ background:"#E9E9E7", borderRadius:"3px", height:"4px", overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:"3px", background:"#2383E2", width:`${scanPct}%`, transition:"width .18s ease" }}/>
              </div>
            </div>
          ) : (
            <>
              <button className="cta" onClick={startLogin} style={{ marginBottom:"10px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google — It's free
              </button>
              <p style={{ fontSize:"12px", color:"#9B9A97", textAlign:"center", fontWeight:400 }}>No credit card · No data selling · Cancel anytime</p>
            </>
          )}
        </div>

        {/* Social proof */}
        <div className="fade s5" style={{ display:"flex", alignItems:"center", gap:"16px", marginTop:"32px", flexWrap:"wrap" }}>
          {["⭐⭐⭐⭐⭐", "12,000+ emails killed", "Free forever plan"].map((t, i) => (
            <span key={i} style={{ fontSize:"12px", color:"#9B9A97", fontWeight:400 }}>{t}</span>
          ))}
        </div>

        {/* ── Stats ── */}
        <div className="fade s5" style={{ display:"grid", gridTemplateColumns: mobile?"1fr 1fr":"1fr 1fr 1fr", gap:"1px", background:"#E9E9E7", border:"1px solid #E9E9E7", borderRadius:"8px", overflow:"hidden", marginTop:"48px" }}>
          {[
            { num:"12K+", label:"Emails unsubscribed", icon:"📧" },
            { num:"Zero", label:"Alternatives in India", icon:"🇮🇳" },
            { num:"Free", label:"Basic plan forever",   icon:"🎁" },
          ].map((s, i) => (
            <div key={i} style={{ background:"#fff", padding: mobile?"16px 14px":"20px 20px", textAlign:"center" }}
              className={mobile && i===2 ? "hide-mobile" : ""}
            >
              <div style={{ fontSize: mobile?"20px":"24px", marginBottom:"6px" }}>{s.icon}</div>
              <div className="stat-num" style={{ fontSize: mobile?"20px":"24px", fontWeight:700, color:"#37352f", letterSpacing:"-.5px", marginBottom:"4px" }}>{s.num}</div>
              <div className="stat-lbl" style={{ fontSize: mobile?"10px":"12px", color:"#9B9A97", fontWeight:400 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── How it works ── */}
        <div style={{ marginTop: mobile?"48px":"64px" }}>
          <h2 style={{ fontSize: mobile?"18px":"22px", fontWeight:700, color:"#37352f", letterSpacing:"-.3px", marginBottom:"4px" }}>How it works</h2>
          <p style={{ fontSize:"13px", color:"#9B9A97", fontWeight:400, marginBottom:"24px" }}>Three steps. No setup required.</p>

          <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
            {[
              { icon:"🔐", step:"1", title:"Connect Gmail",   desc:"One-click Google OAuth. Read-only access. We never store emails." },
              { icon:"📋", step:"2", title:"Review Senders",  desc:"See every subscription, newsletter and promo sorted by email count." },
              { icon:"🗑️", step:"3", title:"Unsubscribe",     desc:"Select all or individually. We click every unsubscribe link for you." },
            ].map((s, i) => (
              <div key={i} className="n-hover" style={{ display:"flex", alignItems:"flex-start", gap:"14px", padding:"12px 10px" }}>
                <div style={{ width:"32px", height:"32px", borderRadius:"6px", background:"#F7F6F3", border:"1px solid #E9E9E7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:600, color:"#37352f", marginBottom:"3px" }}>{s.title}</div>
                  <div style={{ fontSize:"13px", color:"#9B9A97", fontWeight:400, lineHeight:1.55 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ marginTop: mobile?"40px":"56px", paddingTop:"24px", borderTop:"1px solid #E9E9E7", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <Logo size={20}/>
            <span style={{ fontSize:"13px", color:"#9B9A97", fontWeight:400 }}>MyMailDetox</span>
          </div>
          <span style={{ fontSize:"12px", color:"#C4C4C2" }}>© 2025 · Built for people who hate inbox clutter</span>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════ DASHBOARD ════════════════════════ */
  return (
    <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter',sans-serif", color:"#37352f" }}>
      <style>{CSS}</style>

      {/* ── Sidebar + Main layout ── */}
      <div style={{ display:"flex", minHeight:"100vh" }}>

        {/* Sidebar — desktop only */}
        {!mobile && (
          <div style={{ width:"240px", flexShrink:0, borderRight:"1px solid #E9E9E7", padding:"12px 8px", display:"flex", flexDirection:"column", gap:"2px", position:"sticky", top:0, height:"100vh", overflowY:"auto" }}>
            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", marginBottom:"8px" }}>
              <Logo size={26}/>
              <span style={{ fontSize:"15px", fontWeight:600, color:"#37352f" }}>MyMailDetox</span>
            </div>
            <div className="divider" style={{ margin:"0 0 8px" }}/>

            {/* Nav items */}
            {[
              { icon:"📬", label:"Subscriptions", active:true },
              { icon:"📊", label:"Analytics",     active:false },
              { icon:"⚙️", label:"Settings",      active:false },
            ].map((n, i) => (
              <div key={i} className="n-hover" style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 10px", borderRadius:"5px", background: n.active ? "rgba(55,53,47,.08)" : "transparent", cursor:"pointer" }}>
                <span style={{ fontSize:"15px" }}>{n.icon}</span>
                <span style={{ fontSize:"14px", fontWeight: n.active?500:400, color: n.active?"#37352f":"#9B9A97" }}>{n.label}</span>
              </div>
            ))}

            <div style={{ marginTop:"auto" }}>
              <div className="divider" style={{ marginBottom:"8px" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px" }}>
                <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#37352f", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:600, color:"#fff", flexShrink:0 }}>S</div>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:500, color:"#37352f" }}>Suraj</div>
                  <div style={{ fontSize:"11px", color:"#9B9A97" }}>suraj@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>

          {/* Mobile topbar */}
          {mobile && (
            <div style={{ borderBottom:"1px solid #E9E9E7", padding:"11px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:"#fff", zIndex:50 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <Logo size={26}/>
                <span style={{ fontSize:"15px", fontWeight:600, color:"#37352f" }}>MyMailDetox</span>
              </div>
              <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"#37352f", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:600, color:"#fff" }}>S</div>
            </div>
          )}

          {/* Page content */}
          <div style={{ padding: mobile?"20px 16px 120px":"32px 40px 100px", maxWidth:"860px" }}>

            {/* Page title — Notion style */}
            <div style={{ marginBottom:"28px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
                <span style={{ fontSize: mobile?"28px":"32px" }}>📬</span>
                <h1 className="page-title" style={{ fontSize: mobile?"20px":"26px", fontWeight:700, color:"#37352f", letterSpacing:"-.3px" }}>Subscriptions</h1>
              </div>
              <p style={{ fontSize:"14px", color:"#9B9A97", fontWeight:400, marginLeft: mobile?"0":"42px" }}>Manage and clean your email subscriptions</p>
            </div>

            {/* Stats row — Notion-style property blocks */}
            <div style={{ display:"flex", gap: mobile?"8px":"16px", marginBottom:"28px", flexWrap:"wrap" }}>
              {[
                { label:"Total senders", value:subs.length,                 icon:"📧" },
                { label:"Emails wasted", value:total.toLocaleString(),       icon:"📩" },
                { label:"Selected",      value:selected.length,             icon:"✅" },
              ].map((s, i) => (
                <div key={i} style={{ background:"#F7F6F3", border:"1px solid #E9E9E7", borderRadius:"6px", padding: mobile?"10px 12px":"12px 16px", minWidth: mobile?"80px":"110px", flex:1 }}>
                  <div style={{ fontSize:"11px", color:"#9B9A97", fontWeight:400, marginBottom:"4px", display:"flex", alignItems:"center", gap:"4px" }}>
                    <span>{s.icon}</span> {s.label}
                  </div>
                  <div className="stat-num" style={{ fontSize: mobile?"20px":"22px", fontWeight:700, color:"#37352f", letterSpacing:"-.5px" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Search + Filter bar */}
            <div style={{ marginBottom:"16px" }}>
              {/* Search */}
              <div style={{ position:"relative", marginBottom:"10px" }}>
                <span style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", fontSize:"13px", color:"#9B9A97", pointerEvents:"none" }}>🔍</span>
                <input
                  className="search"
                  placeholder="Filter by sender or email..."
                  value={query} onChange={e => setQuery(e.target.value)}
                />
              </div>

              {/* Filter tabs */}
              <div style={{ display:"flex", alignItems:"center", gap:"4px", overflowX:"auto", paddingBottom:"2px" }}>
                {[{k:"ALL",l:"All"},{k:"NEWSLETTER",l:"Newsletter"},{k:"PROMO",l:"Promo"},{k:"SPAM",l:"Spam"}].map(f => (
                  <button key={f.k} className={`f-tab ${filter===f.k?"on":""}`} onClick={() => setFilter(f.k)}>
                    {f.l}
                    <span style={{ marginLeft:"4px", fontSize:"11px", color:"#C4C4C2" }}>
                      {f.k==="ALL" ? subs.length : subs.filter(s=>s.category===f.k).length}
                    </span>
                  </button>
                ))}
                <div style={{ marginLeft:"auto" }}>
                  <button className="f-tab" onClick={toggleAll} style={{ color: allSel?"#EB5757":"#9B9A97" }}>
                    {allSel ? "Deselect all" : "Select all"}
                  </button>
                </div>
              </div>
            </div>

            {/* Column headers */}
            {!mobile && (
              <div style={{ display:"grid", gridTemplateColumns:"28px 40px 1fr 120px 80px 80px", gap:"8px", padding:"4px 10px 6px", alignItems:"center" }}>
                {["", "", "Sender", "Category", "Emails", "Last seen"].map((h, i) => (
                  <div key={i} style={{ fontSize:"11px", fontWeight:500, color:"#9B9A97", letterSpacing:".3px", textTransform:"uppercase" }}>{h}</div>
                ))}
              </div>
            )}
            <div className="divider" style={{ marginBottom:"4px" }}/>

            {/* Subscription list */}
            <div style={{ display:"flex", flexDirection:"column", gap:"1px" }}>
              {filtered.length === 0 ? (
                <div style={{ padding:"60px 0", textAlign:"center" }}>
                  <div style={{ fontSize:"40px", marginBottom:"12px" }}>✨</div>
                  <div style={{ fontSize:"16px", fontWeight:600, color:"#37352f", marginBottom:"6px" }}>Inbox is spotless</div>
                  <div style={{ fontSize:"13px", color:"#9B9A97", fontWeight:400 }}>No subscriptions found</div>
                </div>
              ) : filtered.map((sub, idx) => (
                mobile ? (
                  /* Mobile row */
                  <div key={sub.id} className={`sub-row ${selected.includes(sub.id)?"sel":""}`} style={{ animationDelay:`${idx*.025}s` }} onClick={() => toggle(sub.id)}>
                    <div className={`chk ${selected.includes(sub.id)?"on":""}`}>
                      {selected.includes(sub.id) && <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                    </div>
                    <div style={{ width:"34px", height:"34px", borderRadius:"6px", background:"#F7F6F3", border:"1px solid #E9E9E7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:600, color:"#37352f", flexShrink:0 }}>
                      {sub.sender[0]}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"14px", fontWeight:500, color:"#37352f", marginBottom:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.sender}</div>
                      <div style={{ fontSize:"11px", color:"#9B9A97", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.email}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"4px", justifyContent:"flex-end", marginBottom:"3px" }}>
                        <Dot color={CAT_STYLE[sub.category].dot}/>
                        <span style={{ fontSize:"11px", color:"#9B9A97", fontWeight:400 }}>{sub.category}</span>
                      </div>
                      <div style={{ fontSize:"12px", color:"#37352f", fontWeight:500 }}>{sub.count}</div>
                    </div>
                  </div>
                ) : (
                  /* Desktop row */
                  <div key={sub.id} className={`sub-row ${selected.includes(sub.id)?"sel":""}`}
                    style={{ display:"grid", gridTemplateColumns:"28px 40px 1fr 120px 80px 80px", gap:"8px", alignItems:"center", animationDelay:`${idx*.025}s` }}
                    onClick={() => toggle(sub.id)}
                  >
                    {/* Checkbox */}
                    <div className={`chk ${selected.includes(sub.id)?"on":""}`}>
                      {selected.includes(sub.id) && <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                    </div>
                    {/* Avatar */}
                    <div style={{ width:"34px", height:"34px", borderRadius:"6px", background:"#F7F6F3", border:"1px solid #E9E9E7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:600, color:"#37352f" }}>
                      {sub.sender[0]}
                    </div>
                    {/* Name + email */}
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:"14px", fontWeight:500, color:"#37352f", marginBottom:"1px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.sender}</div>
                      <div style={{ fontSize:"12px", color:"#9B9A97", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.email}</div>
                    </div>
                    {/* Category */}
                    <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                      <Dot color={CAT_STYLE[sub.category].dot}/>
                      <span style={{ fontSize:"13px", color:"#9B9A97", fontWeight:400 }}>{sub.category.charAt(0)+sub.category.slice(1).toLowerCase()}</span>
                    </div>
                    {/* Count */}
                    <div style={{ fontSize:"13px", color:"#37352f", fontWeight:400 }}>{sub.count}</div>
                    {/* Last */}
                    <div style={{ fontSize:"12px", color:"#9B9A97", fontWeight:400 }}>{sub.last}</div>
                  </div>
                )
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── Fixed bottom bar ── */}
      {selected.length > 0 && !done && !unsubbing && (
        <div style={{ position:"fixed", bottom: mobile?"16px":"24px", left:"50%", transform:"translateX(-50%)", zIndex:100, animation:"popIn .2s ease" }}>
          <div style={{ background:"#37352f", borderRadius:"8px", padding:"10px 16px", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 8px 24px rgba(0,0,0,.2)", whiteSpace:"nowrap" }}>
            <span style={{ fontSize:"13px", color:"rgba(255,255,255,.7)", fontWeight:400 }}>{selected.length} selected</span>
            <div style={{ width:"1px", height:"16px", background:"rgba(255,255,255,.15)" }}/>
            <button onClick={doUnsub} style={{ background:"#EB5757", color:"#fff", border:"none", borderRadius:"5px", padding:"5px 14px", fontSize:"13px", fontWeight:500, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"background .12s" }}
              onMouseEnter={e => e.target.style.background="#D44C4C"}
              onMouseLeave={e => e.target.style.background="#EB5757"}
            >
              Unsubscribe →
            </button>
            <button onClick={() => setSelected([])} style={{ background:"transparent", color:"rgba(255,255,255,.5)", border:"none", fontSize:"13px", cursor:"pointer", fontFamily:"'Inter',sans-serif", padding:"4px" }}>✕</button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {unsubbing && (
        <div style={{ position:"fixed", bottom: mobile?"16px":"24px", left:"50%", transform:"translateX(-50%)", zIndex:100, animation:"popIn .2s ease", width: mobile?"calc(100% - 32px)":"360px" }}>
          <div style={{ background:"#37352f", borderRadius:"8px", padding:"14px 18px", boxShadow:"0 8px 24px rgba(0,0,0,.2)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
              <span style={{ fontSize:"13px", color:"rgba(255,255,255,.9)", fontWeight:500 }}>Unsubscribing...</span>
              <span style={{ fontSize:"12px", color:"rgba(255,255,255,.5)" }}>{Math.round(unsubPct)}%</span>
            </div>
            <div style={{ background:"rgba(255,255,255,.15)", borderRadius:"3px", height:"4px", overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:"3px", background:"#2383E2", width:`${unsubPct}%`, transition:"width .12s ease" }}/>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {done && (
        <div style={{ position:"fixed", bottom: mobile?"16px":"24px", left:"50%", transform:"translateX(-50%)", zIndex:100, animation:"popIn .2s ease" }}>
          <div style={{ background:"#37352f", borderRadius:"8px", padding:"10px 18px", boxShadow:"0 8px 24px rgba(0,0,0,.2)", display:"flex", alignItems:"center", gap:"8px", whiteSpace:"nowrap" }}>
            <span style={{ fontSize:"15px" }}>✅</span>
            <span style={{ fontSize:"13px", color:"rgba(255,255,255,.9)", fontWeight:500 }}>Done! Senders unsubscribed successfully</span>
          </div>
        </div>
      )}

    </div>
  );
}
