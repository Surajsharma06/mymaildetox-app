import { useState, useEffect, useRef } from "react";

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

const CAT = {
  PROMO:      { dot:"#F97316", label:"Promo",      light:{ bg:"#FFF7ED", text:"#C2410C", border:"#FED7AA" }, dark:{ bg:"rgba(249,115,22,.12)", text:"#FB923C", border:"rgba(249,115,22,.2)" } },
  NEWSLETTER: { dot:"#818CF8", label:"Newsletter", light:{ bg:"#EEF2FF", text:"#4338CA", border:"#C7D2FE" }, dark:{ bg:"rgba(129,140,248,.12)", text:"#A5B4FC", border:"rgba(129,140,248,.2)" } },
  SPAM:       { dot:"#F87171", label:"Spam",       light:{ bg:"#FEF2F2", text:"#B91C1C", border:"#FECACA" }, dark:{ bg:"rgba(248,113,113,.12)", text:"#FCA5A5", border:"rgba(248,113,113,.2)" } },
};

const DARK = {
  bg0:"#0F0F10", bg1:"#141415", bg2:"#1C1C1E", bg3:"#242426",
  line:"rgba(255,255,255,.07)", line2:"rgba(255,255,255,.11)",
  t1:"#FFFFFF", t2:"#A0A0A8", t3:"#555560",
  accent:"#8B5CF6", accent2:"#7C3AED",
  card:"#141415", cardBorder:"rgba(255,255,255,.07)",
  topbar:"rgba(15,15,16,.85)",
  input:"#141415", inputBorder:"rgba(255,255,255,.07)",
  sidebar:"rgba(15,15,16,.95)",
  rowHover:"#1C1C1E", rowSel:"rgba(139,92,246,.08)",
  chkBorder:"rgba(255,255,255,.15)",
  fabBg:"#1C1C1E", fabBorder:"rgba(255,255,255,.11)",
  green:"#10B981", red:"#EF4444", blue:"#3B82F6",
};

const LIGHT = {
  bg0:"#FFFFFF", bg1:"#F9F9F9", bg2:"#F3F3F3", bg3:"#EBEBEB",
  line:"rgba(0,0,0,.07)", line2:"rgba(0,0,0,.11)",
  t1:"#111111", t2:"#666666", t3:"#999999",
  accent:"#2383E2", accent2:"#1A6FC4",
  card:"#FFFFFF", cardBorder:"rgba(0,0,0,.07)",
  topbar:"rgba(255,255,255,.85)",
  input:"#FFFFFF", inputBorder:"rgba(0,0,0,.1)",
  sidebar:"rgba(255,255,255,.95)",
  rowHover:"#F3F3F3", rowSel:"#EBF5FF",
  chkBorder:"rgba(0,0,0,.18)",
  fabBg:"#111111", fabBorder:"rgba(255,255,255,.15)",
  green:"#059669", red:"#DC2626", blue:"#2563EB",
};

const MSGS = ["Connecting to Gmail...","Reading your inbox...","Detecting subscriptions...","Categorising senders...","Almost there...","Loading results..."];

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { -webkit-text-size-adjust:100%; }
  body { font-family:'DM Sans',-apple-system,sans-serif; -webkit-font-smoothing:antialiased; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  @keyframes popIn    { 0%{opacity:0;transform:translateY(6px) scale(.97)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes gradShift{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes scanMove { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
  @keyframes pulseDot { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes toggleSlide { from{transform:translateX(0)} to{transform:translateX(20px)} }

  .fu1{animation:fadeUp .45s .04s both}
  .fu2{animation:fadeUp .45s .10s both}
  .fu3{animation:fadeUp .45s .16s both}
  .fu4{animation:fadeUp .45s .22s both}
  .fu5{animation:fadeUp .45s .28s both}
  .fu6{animation:fadeUp .45s .34s both}

  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { border-radius:2px; }

  @media(max-width:640px){
    .hide-sm { display:none !important; }
    .sidebar { display:none !important; }
    .col-hdr { display:none !important; }
    .col-divider { display:none !important; }
  }
`;

/* ── Logo ── */
function Logo({ size=28, dark }) {
  const fill = dark ? "#8B5CF6" : "#2383E2";
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="lgg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={dark?"#8B5CF6":"#2383E2"}/>
          <stop offset="100%" stopColor={dark?"#6D28D9":"#1A6FC4"}/>
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="8" fill="url(#lgg)"/>
      <rect x="4" y="9" width="20" height="13" rx="2.5" fill="white" fillOpacity=".92"/>
      <path d="M4 11.5L14 18L24 11.5" stroke={fill} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 17L19 19M19 17L17 19" stroke="#F87171" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="22" cy="6" r="2.2" fill="#10B981"/>
    </svg>
  );
}

/* ── Theme Toggle ── */
function ThemeToggle({ dark, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display:"flex", alignItems:"center", gap:"6px",
      padding:"6px 10px", borderRadius:"8px", cursor:"pointer",
      border:`1px solid ${dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.1)"}`,
      background: dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)",
      transition:"all .2s ease",
    }}>
      <span style={{ fontSize:"14px" }}>{dark ? "🌙" : "☀️"}</span>
      <div style={{
        width:"32px", height:"18px", borderRadius:"9px",
        background: dark?"#8B5CF6":"#D1D5DB",
        position:"relative", transition:"background .2s",
        flexShrink:0,
      }}>
        <div style={{
          width:"14px", height:"14px", borderRadius:"50%",
          background:"#fff", position:"absolute",
          top:"2px", left: dark?"16px":"2px",
          transition:"left .2s ease",
          boxShadow:"0 1px 3px rgba(0,0,0,.2)",
        }}/>
      </div>
      <span style={{ fontSize:"11px", fontWeight:500, color: dark?"#A0A0A8":"#666", whiteSpace:"nowrap" }}>
        {dark ? "Dark" : "Light"}
      </span>
    </button>
  );
}

/* ── Dot ── */
function Dot({ color }) {
  return <span style={{ width:6, height:6, borderRadius:"50%", background:color, display:"inline-block", flexShrink:0 }}/>;
}

/* ── Mesh bg (dark only) ── */
function MeshBg() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-15%", left:"-5%", width:"55vw", height:"55vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.07) 0%,transparent 65%)" }}/>
      <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:"40vw", height:"40vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,.05) 0%,transparent 65%)" }}/>
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.4 }}>
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,.03)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    </div>
  );
}

export default function MyMailDetox() {
  const [screen, setScreen]       = useState("landing");
  const [dark, setDark]           = useState(true);
  const [subs, setSubs]           = useState(SUBS);
  const [selected, setSelected]   = useState([]);
  const [filter, setFilter]       = useState("ALL");
  const [scanning, setScanning]   = useState(false);
  const [scanPct, setScanPct]     = useState(0);
  const [scanMsg, setScanMsg]     = useState("");
  const [unsubbing, setUnsubbing] = useState(false);
  const [unsubPct, setUnsubPct]   = useState(0);
  const [done, setDone]           = useState(false);
  const [query, setQuery]         = useState("");
  const [mobile, setMobile]       = useState(false);
  const [mousePos, setMousePos]   = useState({ x:0, y:0 });

  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (mobile || !dark) return;
    const move = e => setMousePos({ x:e.clientX, y:e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mobile, dark]);

  const startLogin = () => {
    setScanning(true); setScanPct(0); setScanMsg(MSGS[0]);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 9 + 3;
      setScanMsg(MSGS[Math.min(Math.floor((p/100)*MSGS.length), MSGS.length-1)]);
      if (p >= 100) {
        p = 100; clearInterval(iv);
        setScanMsg("Done! Opening your dashboard...");
        setTimeout(() => { setScanning(false); setScreen("dashboard"); }, 600);
      }
      setScanPct(Math.min(p, 100));
    }, 155);
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

  /* ── Shared styles ── */
  const topbarStyle = {
    position:"sticky", top:0, zIndex:100,
    background: T.topbar,
    backdropFilter:"blur(20px) saturate(160%)",
    WebkitBackdropFilter:"blur(20px)",
    borderBottom:`1px solid ${T.line}`,
    padding: mobile?"11px 16px":"13px 28px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
  };

  const cardStyle = {
    background:T.card, border:`1px solid ${T.cardBorder}`,
    borderRadius:"13px", transition:"border-color .2s, transform .2s",
  };

  const btnPrimary = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"7px",
    padding:"9px 18px", border:"none", borderRadius:"9px",
    background: dark ? "linear-gradient(135deg,#8B5CF6,#6D28D9)" : "#2383E2",
    color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:500,
    cursor:"pointer", transition:"all .18s", WebkitTapHighlightColor:"transparent",
  };

  const btnGhost = {
    display:"inline-flex", alignItems:"center", gap:"6px",
    padding:"8px 14px", border:`1px solid ${T.line2}`, borderRadius:"8px",
    background:"transparent", color:T.t2,
    fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:500,
    cursor:"pointer", transition:"all .15s",
  };

  const searchStyle = {
    width:"100%", padding:"9px 12px 9px 36px",
    background:T.input, border:`1px solid ${T.inputBorder}`,
    borderRadius:"9px", color:T.t1,
    fontFamily:"'DM Sans',sans-serif", fontSize:"13px",
    outline:"none", transition:"border-color .15s",
  };

  /* ══════════════ LANDING ══════════════ */
  if (screen === "landing") return (
    <div style={{ minHeight:"100vh", background:T.bg0, fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden", transition:"background .3s" }}>
      <style>{BASE_CSS}</style>
      {dark && <MeshBg/>}

      {/* Light mode subtle bg */}
      {!dark && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
          background:"radial-gradient(ellipse at 20% 10%, #EEF2FF 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, #F0FDF4 0%, transparent 50%)" }}/>
      )}

      {/* Mouse glow - dark only */}
      {dark && !mobile && (
        <div style={{ position:"fixed", left:mousePos.x-200, top:mousePos.y-200, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.06) 0%,transparent 70%)", pointerEvents:"none", zIndex:1, transition:"left .25s ease,top .25s ease" }}/>
      )}

      {/* Topbar */}
      <div style={{ ...topbarStyle, zIndex:10 }} className="fu1">
        <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
          <Logo size={28} dark={dark}/>
          <span style={{ fontSize:"16px", fontWeight:600, color:T.t1, letterSpacing:"-.2px" }}>MyMailDetox</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)}/>
          <button style={btnGhost} className="hide-sm">Log in</button>
          <button style={{ ...btnPrimary, animation:"none" }} onClick={startLogin}>
            Get started free →
          </button>
        </div>
      </div>

      {/* Hero — wider max width */}
      <div style={{ maxWidth:"820px", margin:"0 auto", padding: mobile?"56px 20px 60px":"100px 40px 80px", position:"relative", zIndex:2 }}>

        {/* Badge */}
        <div className="fu2" style={{ marginBottom:"24px" }}>
          <span style={{
            display:"inline-flex", alignItems:"center", gap:"7px",
            background: dark?"rgba(139,92,246,.12)":"rgba(35,131,226,.08)",
            border: dark?"1px solid rgba(139,92,246,.25)":"1px solid rgba(35,131,226,.2)",
            borderRadius:"100px", padding:"5px 14px",
            fontSize:"12px", fontWeight:500,
            color: dark?"#A78BFA":"#2383E2",
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background: dark?"#8B5CF6":"#2383E2", display:"inline-block", animation:"pulseDot 2s ease infinite" }}/>
            The inbox cleaner Unroll.me never built
          </span>
        </div>

        {/* Headline — bold + big */}
        <div className="fu3" style={{ marginBottom:"26px" }}>
          <h1 style={{
            fontSize: mobile?"34px": "68px",
            fontWeight:700, color:T.t1, lineHeight:1.06,
            letterSpacing: mobile?"-1px":"-2.5px", marginBottom:"22px",
            maxWidth:"720px",
          }}>
            Your inbox.<br/>
            <span style={dark ? {
              background:"linear-gradient(135deg,#C4B5FD,#8B5CF6,#6D28D9)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text", backgroundSize:"200% 200%",
              animation:"gradShift 4s ease infinite",
            } : {
              color:"#2383E2",
            }}>
              Finally clean.
            </span>
          </h1>
          <p style={{ fontSize: mobile?"16px":"19px", color:T.t2, lineHeight:1.72, fontWeight:400, maxWidth:"560px" }}>
            100+ useless emails every day? Connect Gmail, see every subscription at a glance, and unsubscribe in one click. Works worldwide.
          </p>
        </div>

        {/* Feature tags */}
        <div className="fu4" style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"36px" }}>
          {["✅ Free forever","🔒 Read-only access","⚡ One-click unsubscribe","🌍 Works worldwide"].map((t,i) => (
            <span key={i} style={{
              display:"inline-flex", alignItems:"center", gap:"5px",
              background: dark?"rgba(255,255,255,.05)":T.bg2,
              border:`1px solid ${T.line}`, borderRadius:"100px",
              padding:"6px 13px", fontSize:"12px", fontWeight:500, color:T.t2,
            }}>{t}</span>
          ))}
        </div>

        {/* CTA block */}
        <div className="fu5" style={{ maxWidth:"420px", marginBottom:"60px" }}>
          {scanning ? (
            <div style={{ ...cardStyle, padding:"22px", position:"relative", overflow:"hidden",
              border: dark?"1px solid rgba(139,92,246,.3)":cardStyle.border,
            }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px",
                background:`linear-gradient(90deg,transparent,${T.accent},transparent)`,
                animation:"scanMove 1.8s ease-in-out infinite",
              }}/>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                <div style={{ animation:"float 2s ease-in-out infinite" }}><Logo size={22} dark={dark}/></div>
                <span style={{ fontSize:"14px", fontWeight:500, color:T.t1 }}>{scanMsg}</span>
                <span style={{ marginLeft:"auto", fontSize:"13px", color:T.t3, fontVariantNumeric:"tabular-nums" }}>{Math.round(scanPct)}%</span>
              </div>
              <div style={{ background:T.bg3, borderRadius:"4px", height:"3px", overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:"4px", background:`linear-gradient(90deg,${T.accent},${dark?"#A78BFA":T.blue})`, width:`${scanPct}%`, transition:"width .2s ease" }}/>
              </div>
              <p style={{ marginTop:"10px", fontSize:"11px", color:T.t3 }}>Read-only · Your data never leaves Google</p>
            </div>
          ) : (
            <>
              <button
                style={{ ...btnPrimary, width:"100%", padding:"14px 24px", fontSize:"15px", borderRadius:"11px", marginBottom:"11px" }}
                onClick={startLogin}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google — It's free
              </button>
              <p style={{ textAlign:"center", fontSize:"12px", color:T.t3 }}>No credit card · No data selling · Cancel anytime</p>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="fu5" style={{ display:"grid", gridTemplateColumns: mobile?"1fr 1fr":"1fr 1fr 1fr", gap:"12px", marginBottom:"64px" }}>
          {[
            { num:"12K+", label:"Emails cleaned",     color: dark?"#A78BFA":"#2383E2" },
            { num:"4.9★", label:"Average rating",     color: dark?"#FCD34D":"#F59E0B" },
            { num:"Free", label:"Basic plan forever", color: dark?"#6EE7B7":T.green   },
          ].map((s,i) => (
            <div key={i} style={{ ...cardStyle, padding: mobile?"16px 12px":"22px 18px", textAlign:"center" }}>
              <div style={{ fontSize: mobile?"24px":"28px", fontWeight:700, color:s.color, letterSpacing:"-.5px", marginBottom:"5px" }}>{s.num}</div>
              <div style={{ fontSize:"12px", color:T.t3, fontWeight:400 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="fu6">
          <h2 style={{ fontSize: mobile?"20px":"24px", fontWeight:700, color:T.t1, letterSpacing:"-.4px", marginBottom:"5px" }}>How it works</h2>
          <p style={{ fontSize:"14px", color:T.t3, marginBottom:"20px" }}>Three steps. No setup. Works in minutes.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {[
              { icon:"🔐", n:"01", title:"Connect Gmail",   desc:"One-click Google OAuth. Read-only. We never store or read your emails.", c: dark?"rgba(139,92,246,.15)":"rgba(35,131,226,.08)" },
              { icon:"📋", n:"02", title:"Review Senders",  desc:"Every newsletter, promo & subscription listed clearly by sender and count.", c: dark?"rgba(59,130,246,.15)":"rgba(16,185,129,.08)"  },
              { icon:"🗑️", n:"03", title:"Unsubscribe",     desc:"Select individually or all at once. Gone permanently in one click.",       c: dark?"rgba(16,185,129,.15)":"rgba(249,115,22,.08)"  },
            ].map((s,i) => (
              <div key={i} style={{ ...cardStyle, padding: mobile?"14px 16px":"18px 20px", display:"flex", alignItems:"flex-start", gap:"14px" }}>
                <div style={{ width:"38px", height:"38px", borderRadius:"10px", background:s.c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                    <span style={{ fontSize:"10px", fontWeight:600, color:T.t3, letterSpacing:".5px" }}>{s.n}</span>
                    <span style={{ fontSize:"14px", fontWeight:600, color:T.t1 }}>{s.title}</span>
                  </div>
                  <p style={{ fontSize:"13px", color:T.t2, fontWeight:400, lineHeight:1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop:"56px", paddingTop:"20px", borderTop:`1px solid ${T.line}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <Logo size={18} dark={dark}/>
            <span style={{ fontSize:"13px", color:T.t3 }}>MyMailDetox</span>
          </div>
          <span style={{ fontSize:"12px", color:T.t3 }}>© 2025 · Built for inbox clutter haters</span>
        </div>
      </div>
    </div>
  );

  /* ══════════════ DASHBOARD ══════════════ */
  return (
    <div style={{ minHeight:"100vh", background:T.bg0, fontFamily:"'DM Sans',sans-serif", color:T.t2, transition:"background .3s" }}>
      <style>{BASE_CSS}</style>
      {dark && <MeshBg/>}
      {!dark && <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 80% 5%, #EEF2FF 0%, transparent 40%)" }}/>}

      <div style={{ display:"flex", minHeight:"100vh", position:"relative", zIndex:1 }}>

        {/* Sidebar */}
        {!mobile && (
          <div className="sidebar" style={{ width:"220px", flexShrink:0, borderRight:`1px solid ${T.line}`, padding:"12px 8px", display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", overflowY:"auto", background:T.sidebar }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 10px 16px" }}>
              <Logo size={24} dark={dark}/>
              <span style={{ fontSize:"14px", fontWeight:600, color:T.t1 }}>MyMailDetox</span>
            </div>
            <div style={{ height:"1px", background:T.line, marginBottom:"8px" }}/>

            {[
              { icon:"📬", label:"Subscriptions", active:true },
              { icon:"📊", label:"Analytics",     active:false },
              { icon:"⚙️", label:"Settings",      active:false },
            ].map((n,i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:"8px",
                padding:"6px 10px", borderRadius:"7px",
                background: n.active ? T.bg2 : "transparent",
                cursor:"pointer", transition:"background .12s",
                fontSize:"13px", fontWeight: n.active?500:400,
                color: n.active ? T.t1 : T.t3,
              }}>
                <span style={{ fontSize:"14px" }}>{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}

            <div style={{ marginTop:"auto" }}>
              <div style={{ height:"1px", background:T.line, marginBottom:"8px" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px" }}>
                <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},${T.accent2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:700, color:"#fff", flexShrink:0 }}>S</div>
                <div>
                  <div style={{ fontSize:"12px", fontWeight:500, color:T.t1 }}>Suraj</div>
                  <div style={{ fontSize:"11px", color:T.t3 }}>suraj@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* Mobile topbar */}
          {mobile && (
            <div style={topbarStyle}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <Logo size={24} dark={dark}/>
                <span style={{ fontSize:"15px", fontWeight:600, color:T.t1 }}>MyMailDetox</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <ThemeToggle dark={dark} onToggle={() => setDark(d=>!d)}/>
                <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},${T.accent2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:700, color:"#fff" }}>S</div>
              </div>
            </div>
          )}

          {/* Desktop topbar for dashboard */}
          {!mobile && (
            <div style={{ ...topbarStyle, position:"sticky" }}>
              <span style={{ fontSize:"15px", fontWeight:600, color:T.t1 }}>Subscriptions</span>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <ThemeToggle dark={dark} onToggle={() => setDark(d=>!d)}/>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"11px", color:T.t3 }}>Logged in as</div>
                    <div style={{ fontSize:"12px", fontWeight:500, color:T.t1 }}>suraj@gmail.com</div>
                  </div>
                  <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},${T.accent2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:700, color:"#fff" }}>S</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ padding: mobile?"18px 14px 110px":"28px 36px 90px", maxWidth:"900px" }}>

            {/* Header */}
            {!mobile && (
              <div style={{ marginBottom:"24px" }}>
                <h1 style={{ fontSize:"26px", fontWeight:700, color:T.t1, letterSpacing:"-.4px", marginBottom:"3px" }}>Subscriptions</h1>
                <p style={{ fontSize:"13px", color:T.t3 }}>Manage and clean your email subscriptions</p>
              </div>
            )}

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns: mobile?"1fr 1fr":"1fr 1fr 1fr", gap:"10px", marginBottom:"20px" }}>
              {[
                { label:"Total Senders", value:subs.length,                 color: dark?"#A78BFA":"#2383E2", icon:"📧" },
                { label:"Emails Wasted", value:total.toLocaleString(),       color: dark?"#60A5FA":T.blue,    icon:"📩" },
                { label:"Selected",      value:selected.length,             color: dark?"#6EE7B7":T.green,   icon:"✓"  },
              ].map((s,i) => (
                <div key={i} style={{ background:T.bg1, border:`1px solid ${T.line}`, borderRadius:"10px", padding: mobile?"11px 12px":"12px 16px", display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontSize:"18px" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: mobile?"18px":"20px", fontWeight:700, color:s.color, letterSpacing:"-.4px", lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:"11px", color:T.t3, marginTop:"2px" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{ position:"relative", marginBottom:"9px" }}>
              <span style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", fontSize:"13px", color:T.t3, pointerEvents:"none" }}>🔍</span>
              <input style={searchStyle} placeholder="Filter by sender or email..." value={query} onChange={e => setQuery(e.target.value)}
                onFocus={e => e.target.style.borderColor=T.accent}
                onBlur={e => e.target.style.borderColor=T.inputBorder}
              />
            </div>

            {/* Filters */}
            <div style={{ display:"flex", gap:"3px", marginBottom:"14px", overflowX:"auto", paddingBottom:"2px", alignItems:"center" }}>
              {[{k:"ALL",l:"All"},{k:"NEWSLETTER",l:"Newsletter"},{k:"PROMO",l:"Promo"},{k:"SPAM",l:"Spam"}].map(f => {
                const on = filter === f.k;
                return (
                  <button key={f.k} onClick={() => setFilter(f.k)} style={{
                    padding:"5px 11px", borderRadius:"7px",
                    border: on?`1px solid ${T.line2}`:"none",
                    background: on?T.bg2:"transparent",
                    fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:500,
                    color: on?T.t1:T.t3, cursor:"pointer", transition:"all .14s", whiteSpace:"nowrap",
                  }}>
                    {f.l} <span style={{ marginLeft:"3px", color:T.t3, fontSize:"11px" }}>({f.k==="ALL"?subs.length:subs.filter(s=>s.category===f.k).length})</span>
                  </button>
                );
              })}
              <button onClick={toggleAll} style={{
                marginLeft:"auto", padding:"5px 11px", borderRadius:"7px", border:"none",
                background:"transparent", fontFamily:"'DM Sans',sans-serif", fontSize:"13px",
                fontWeight:500, color: allSel?T.red:T.t3, cursor:"pointer", whiteSpace:"nowrap",
              }}>
                {allSel ? "Deselect all" : "Select all"}
              </button>
            </div>

            {/* Column headers */}
            {!mobile && (
              <>
                <div className="col-hdr" style={{ display:"grid", gridTemplateColumns:"22px 38px 1fr 120px 70px 85px", gap:"8px", padding:"3px 12px 7px", alignItems:"center" }}>
                  {["","","Sender","Category","Emails","Last seen"].map((h,i) => (
                    <div key={i} style={{ fontSize:"10px", fontWeight:500, color:T.t3, letterSpacing:".4px", textTransform:"uppercase" }}>{h}</div>
                  ))}
                </div>
                <div className="col-divider" style={{ height:"1px", background:T.line, marginBottom:"4px" }}/>
              </>
            )}

            {/* List */}
            <div style={{ display:"flex", flexDirection:"column", gap:"1px" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 0" }}>
                  <div style={{ fontSize:"40px", marginBottom:"12px" }}>✓</div>
                  <div style={{ fontSize:"16px", fontWeight:600, color:T.t1, marginBottom:"5px" }}>Inbox is spotless</div>
                  <div style={{ fontSize:"13px", color:T.t3 }}>No subscriptions found</div>
                </div>
              ) : filtered.map((sub, idx) => {
                const sel = selected.includes(sub.id);
                const cs = CAT[sub.category][dark?"dark":"light"];
                return mobile ? (
                  <div key={sub.id} onClick={() => toggle(sub.id)} style={{
                    display:"flex", alignItems:"center", gap:"12px",
                    padding:"10px 12px", borderRadius:"9px",
                    cursor:"pointer", background: sel?T.rowSel:"transparent",
                    transition:"background .12s", animation:`slideIn .28s ${idx*.022}s both`,
                  }}>
                    <div style={{ width:"17px", height:"17px", borderRadius:"5px", flexShrink:0, border:`1.5px solid ${sel?T.accent:T.chkBorder}`, background: sel?T.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {sel && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                    </div>
                    <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:T.bg2, border:`1px solid ${T.line}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:600, color:T.t1, flexShrink:0 }}>{sub.sender[0]}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"13px", fontWeight:500, color:T.t1, marginBottom:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.sender}</div>
                      <div style={{ fontSize:"11px", color:T.t3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.email}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"4px", justifyContent:"flex-end", marginBottom:"2px" }}>
                        <Dot color={CAT[sub.category].dot}/><span style={{ fontSize:"11px", color:T.t3 }}>{CAT[sub.category].label}</span>
                      </div>
                      <div style={{ fontSize:"12px", color:T.t1, fontWeight:500 }}>{sub.count}</div>
                    </div>
                  </div>
                ) : (
                  <div key={sub.id} onClick={() => toggle(sub.id)} style={{
                    display:"grid", gridTemplateColumns:"22px 38px 1fr 120px 70px 85px",
                    gap:"8px", alignItems:"center", padding:"9px 12px",
                    borderRadius:"9px", cursor:"pointer",
                    background: sel?T.rowSel:"transparent",
                    transition:"background .12s",
                    animation:`slideIn .28s ${idx*.022}s both`,
                  }}
                    onMouseEnter={e => { if(!sel) e.currentTarget.style.background=T.rowHover; }}
                    onMouseLeave={e => { if(!sel) e.currentTarget.style.background="transparent"; }}
                  >
                    <div style={{ width:"17px", height:"17px", borderRadius:"5px", border:`1.5px solid ${sel?T.accent:T.chkBorder}`, background: sel?T.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {sel && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                    </div>
                    <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:T.bg2, border:`1px solid ${T.line}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:600, color:T.t1 }}>{sub.sender[0]}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:"13px", fontWeight:500, color:T.t1, marginBottom:"1px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.sender}</div>
                      <div style={{ fontSize:"11px", color:T.t3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.email}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                      <Dot color={CAT[sub.category].dot}/>
                      <span style={{ fontSize:"12px", color:T.t2 }}>{CAT[sub.category].label}</span>
                    </div>
                    <div style={{ fontSize:"13px", color:T.t1, fontWeight:500 }}>{sub.count}</div>
                    <div style={{ fontSize:"11px", color:T.t3 }}>{sub.last}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating action */}
      {selected.length > 0 && !done && !unsubbing && (
        <div style={{ position:"fixed", bottom: mobile?"14px":"22px", left:"50%", transform:"translateX(-50%)", zIndex:200, animation:"popIn .18s ease" }}>
          <div style={{ background:T.fabBg, border:`1px solid ${T.fabBorder}`, borderRadius:"11px", padding:"9px 14px", display:"flex", alignItems:"center", gap:"12px", boxShadow:`0 8px 32px rgba(0,0,0,${dark?.7:.15})`, whiteSpace:"nowrap", backdropFilter:"blur(12px)" }}>
            <span style={{ fontSize:"13px", color: dark?"rgba(255,255,255,.6)":"rgba(255,255,255,.8)" }}>{selected.length} selected</span>
            <div style={{ width:"1px", height:"14px", background: dark?"rgba(255,255,255,.1)":"rgba(255,255,255,.2)" }}/>
            <button onClick={doUnsub} style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"7px 16px", border:"none", borderRadius:"7px", background:T.red, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:500, cursor:"pointer" }}>
              Unsubscribe →
            </button>
            <button onClick={() => setSelected([])} style={{ background:"transparent", color: dark?"rgba(255,255,255,.4)":"rgba(255,255,255,.6)", border:"none", fontSize:"16px", cursor:"pointer", padding:"2px 4px", lineHeight:1 }}>×</button>
          </div>
        </div>
      )}

      {/* Progress */}
      {unsubbing && (
        <div style={{ position:"fixed", bottom: mobile?"14px":"22px", left:"50%", transform:"translateX(-50%)", zIndex:200, animation:"popIn .18s ease", width: mobile?"calc(100% - 28px)":"300px" }}>
          <div style={{ background:T.fabBg, border:`1px solid ${T.fabBorder}`, borderRadius:"11px", padding:"14px 16px", boxShadow:`0 8px 32px rgba(0,0,0,${dark?.7:.15})` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
              <span style={{ fontSize:"13px", color: dark?"#fff":T.t1, fontWeight:500 }}>Unsubscribing...</span>
              <span style={{ fontSize:"12px", color: dark?"rgba(255,255,255,.4)":T.t3, fontVariantNumeric:"tabular-nums" }}>{Math.round(unsubPct)}%</span>
            </div>
            <div style={{ background: dark?T.bg3:T.bg2, borderRadius:"3px", height:"3px", overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:"3px", background:`linear-gradient(90deg,${T.accent},${dark?"#A78BFA":T.blue})`, width:`${unsubPct}%`, transition:"width .12s ease" }}/>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {done && (
        <div style={{ position:"fixed", bottom: mobile?"14px":"22px", left:"50%", transform:"translateX(-50%)", zIndex:200, animation:"popIn .18s ease" }}>
          <div style={{ background:T.fabBg, border:`1px solid ${dark?"rgba(16,185,129,.3)":"rgba(5,150,105,.2)"}`, borderRadius:"11px", padding:"10px 18px", boxShadow:`0 8px 32px rgba(0,0,0,${dark?.7:.15})`, display:"flex", alignItems:"center", gap:"8px", whiteSpace:"nowrap" }}>
            <span style={{ color:T.green, fontSize:"14px", fontWeight:700 }}>✓</span>
            <span style={{ fontSize:"13px", color: dark?"#fff":T.t1, fontWeight:500 }}>Senders unsubscribed successfully</span>
          </div>
        </div>
      )}
    </div>
  );
}