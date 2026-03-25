import { useState, useEffect } from "react";

const CAT = {
  PROMO:      { dot:"#F97316", label:"Promo",      dotColor:"#F97316" },
  NEWSLETTER: { dot:"#3B82F6", label:"Newsletter",  dotColor:"#3B82F6" },
  SPAM:       { dot:"#EF4444", label:"Spam",        dotColor:"#EF4444" },
};

// Avatar colors based on first letter
const AV_COLORS = {
  A:"linear-gradient(135deg,#8B5CF6,#6D28D9)",
  B:"linear-gradient(135deg,#EF4444,#DC2626)",
  C:"linear-gradient(135deg,#06B6D4,#0891B2)",
  D:"linear-gradient(135deg,#8B5CF6,#6D28D9)",
  E:"linear-gradient(135deg,#10B981,#059669)",
  F:"linear-gradient(135deg,#F97316,#EA580C)",
  G:"linear-gradient(135deg,#14B8A6,#0D9488)",
  H:"linear-gradient(135deg,#EC4899,#BE185D)",
  I:"linear-gradient(135deg,#6366F1,#4338CA)",
  J:"linear-gradient(135deg,#F59E0B,#D97706)",
  K:"linear-gradient(135deg,#EC4899,#BE185D)",
  L:"linear-gradient(135deg,#3B82F6,#1D4ED8)",
  M:"linear-gradient(135deg,#8B5CF6,#6D28D9)",
  N:"linear-gradient(135deg,#10B981,#059669)",
  O:"linear-gradient(135deg,#F97316,#EA580C)",
  P:"linear-gradient(135deg,#F97316,#EA580C)",
  Q:"linear-gradient(135deg,#6366F1,#4338CA)",
  R:"linear-gradient(135deg,#EF4444,#DC2626)",
  S:"linear-gradient(135deg,#14B8A6,#0D9488)",
  T:"linear-gradient(135deg,#3B82F6,#1D4ED8)",
  U:"linear-gradient(135deg,#8B5CF6,#6D28D9)",
  V:"linear-gradient(135deg,#10B981,#059669)",
  W:"linear-gradient(135deg,#F59E0B,#D97706)",
  X:"linear-gradient(135deg,#EF4444,#DC2626)",
  Y:"linear-gradient(135deg,#F59E0B,#D97706)",
  Z:"linear-gradient(135deg,#06B6D4,#0891B2)",
};

function getAvColor(name) {
  const letter = (name||'?')[0].toUpperCase();
  return AV_COLORS[letter] || "linear-gradient(135deg,#8B5CF6,#6D28D9)";
}

const DARK = {
  bg0:"#0F0F10", bg1:"#141415", bg2:"#1C1C1E", bg3:"#242426",
  line:"rgba(255,255,255,.06)", line2:"rgba(255,255,255,.11)",
  t1:"#FFFFFF", t2:"#A0A0A8", t3:"#555560",
  accent:"#8B5CF6", accent2:"#7C3AED",
  card:"#141415", cardBorder:"rgba(255,255,255,.07)",
  topbar:"rgba(15,15,16,.85)", input:"rgba(255,255,255,.04)", inputBorder:"rgba(255,255,255,.07)",
  sidebar:"rgba(15,15,16,.97)", rowHover:"rgba(255,255,255,.04)", rowSel:"rgba(139,92,246,.08)",
  chkBorder:"rgba(255,255,255,.15)", fabBg:"#1C1C1E", fabBorder:"rgba(255,255,255,.12)",
  green:"#10B981", red:"#EF4444", blue:"#3B82F6",
};

const LIGHT = {
  bg0:"#F7F7F5", bg1:"#FFFFFF", bg2:"#F3F3F3", bg3:"#EBEBEB",
  line:"rgba(0,0,0,.06)", line2:"rgba(0,0,0,.11)",
  t1:"#111111", t2:"#666666", t3:"#999999",
  accent:"#4F46E5", accent2:"#4338CA",
  card:"#FFFFFF", cardBorder:"rgba(0,0,0,.07)",
  topbar:"rgba(247,247,245,.9)", input:"rgba(0,0,0,.03)", inputBorder:"rgba(0,0,0,.09)",
  sidebar:"rgba(255,255,255,.97)", rowHover:"rgba(0,0,0,.025)", rowSel:"rgba(99,102,241,.06)",
  chkBorder:"rgba(0,0,0,.18)", fabBg:"#111111", fabBorder:"rgba(255,255,255,.15)",
  green:"#059669", red:"#DC2626", blue:"#2563EB",
};

const MSGS = ["Connecting to Gmail...","Reading your inbox...","Detecting subscriptions...","Categorising senders...","Almost there...","Loading results..."];
const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'DM Sans',-apple-system,sans-serif; -webkit-font-smoothing:antialiased; }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  @keyframes popIn     { 0%{opacity:0;transform:translateY(6px) scale(.97)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes scanMove  { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
  @keyframes pulseDot  { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .fu1{animation:fadeUp .45s .04s both} .fu2{animation:fadeUp .45s .10s both}
  .fu3{animation:fadeUp .45s .16s both} .fu4{animation:fadeUp .45s .22s both}
  .fu5{animation:fadeUp .45s .28s both} .fu6{animation:fadeUp .45s .34s both}
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{border-radius:2px}
  @media(max-width:640px){
    .hide-sm{display:none!important} .sidebar{display:none!important}
    .col-hdr{display:none!important} .col-div{display:none!important}
    .desk-only{display:none!important}
  }
`;

function Logo({ size=28, dark }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={dark?"#8B5CF6":"#4F46E5"}/><stop offset="100%" stopColor={dark?"#6D28D9":"#4338CA"}/></linearGradient></defs>
      <rect width="28" height="28" rx="8" fill="url(#lg)"/>
      <rect x="4" y="9" width="20" height="13" rx="2.5" fill="white" fillOpacity=".92"/>
      <path d="M4 11.5L14 18L24 11.5" stroke={dark?"#8B5CF6":"#4F46E5"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 17L19 19M19 17L17 19" stroke="#F87171" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="22" cy="6" r="2.2" fill="#10B981"/>
    </svg>
  );
}

function ThemeToggle({ dark, onToggle }) {
  return (
    <button onClick={onToggle} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"6px 10px", borderRadius:"8px", cursor:"pointer", border:`1px solid ${dark?"rgba(255,255,255,.09)":"rgba(0,0,0,.1)"}`, background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)", transition:"all .2s" }}>
      <span style={{ fontSize:"13px" }}>{dark?"🌙":"☀️"}</span>
      <div style={{ width:"28px", height:"16px", borderRadius:"8px", background:dark?"#8B5CF6":"#D1D5DB", position:"relative", transition:"background .2s", flexShrink:0 }}>
        <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:"#fff", position:"absolute", top:"2px", left:dark?"14px":"2px", transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }}/>
      </div>
      <span style={{ fontSize:"11px", fontWeight:500, color:dark?"#A0A0A8":"#666", whiteSpace:"nowrap" }}>{dark?"Dark":"Light"}</span>
    </button>
  );
}

function MeshBg() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-15%", left:"-5%", width:"55vw", height:"55vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.07) 0%,transparent 65%)" }}/>
      <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:"40vw", height:"40vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,.05) 0%,transparent 65%)" }}/>
    </div>
  );
}

export default function MailDetox() {
  const [screen, setScreen]         = useState("landing");
  const [activePage, setActivePage] = useState("subscriptions");
  const [dark, setDark]             = useState(true);
  const [subs, setSubs]             = useState([]);
  const [selected, setSelected]     = useState([]);
  const [filter, setFilter]         = useState("ALL");
  const [scanning, setScanning]     = useState(false);
  const [scanPct, setScanPct]       = useState(0);
  const [scanMsg, setScanMsg]       = useState("");
  const [unsubbing, setUnsubbing]   = useState(false);
  const [unsubPct, setUnsubPct]     = useState(0);
  const [doneToast, setDoneToast]   = useState(false);
  const [query, setQuery]           = useState("");
  const [mobile, setMobile]         = useState(false);
  const [mousePos, setMousePos]     = useState({ x:0, y:0 });
  const [loading, setLoading]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const [userEmail, setUserEmail]   = useState("");
  const [history, setHistory]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("unsub_history") || "[]"); } catch { return []; }
  });
  const [modal, setModal]           = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("gmail_token", token);
      window.history.replaceState({}, "", "/");
      setScreen("dashboard");
    }
  }, []);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (mobile || !dark) return;
    const fn = e => setMousePos({ x:e.clientX, y:e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [mobile, dark]);

  const fetchData = () => {
    const token = localStorage.getItem("gmail_token");
    if (!token) return;
    setLoading(true); setProgress(0); setSubs([]);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 5 + 1.5;
      if (p >= 88) { clearInterval(iv); p = 88; }
      setProgress(Math.round(p));
    }, 350);
    fetch(`${BACKEND}/user`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.email) setUserEmail(d.email); }).catch(() => {});
    fetch(`${BACKEND}/subscriptions`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        clearInterval(iv);
        if (d.subscriptions) setSubs(d.subscriptions);
        setProgress(100);
        setTimeout(() => setLoading(false), 700);
      })
      .catch(() => { clearInterval(iv); setLoading(false); });
  };

  useEffect(() => { if (screen === "dashboard") fetchData(); }, [screen]);

  // Close user menu on outside click
  useEffect(() => {
    const fn = () => setShowUserMenu(false);
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);

  const startLogin = async () => {
    setScanning(true); setScanPct(0); setScanMsg(MSGS[0]);
    try {
      const res = await fetch(`${BACKEND}/auth/google`);
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setScanning(false);
      alert("Backend not running! Start node server.js first.");
    }
  };

  const logout = () => {
    localStorage.removeItem("gmail_token");
    setUserEmail(""); setSubs([]); setSelected([]);
    setScreen("landing"); setActivePage("subscriptions");
  };

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

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

  const doUnsub = async () => {
    if (!selected.length) return;
    setUnsubbing(true); setUnsubPct(0);
    const token = localStorage.getItem("gmail_token");
    const toUnsub = subs.filter(s => selected.includes(s.id));
    let done = 0;
    const newHist = [];
    for (const sub of toUnsub) {
      try {
        await fetch(`${BACKEND}/unsubscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ unsubUrl: sub.unsubUrl, messageIds: sub.messageIds || [] })
        });
        newHist.push({ sender:sub.sender, email:sub.email, category:sub.category, count:sub.count, date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) });
      } catch {}
      done++;
      setUnsubPct(Math.round((done / toUnsub.length) * 100));
    }
    const updated = [...newHist, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem("unsub_history", JSON.stringify(updated));
    setSubs(s => s.filter(x => !selected.includes(x.id)));
    setSelected([]); setUnsubbing(false); setDoneToast(true);
    setTimeout(() => setDoneToast(false), 3000);
  };

  // Permanent delete — seedha delete, trash mein bhi nahi jaata
  const doDelete = async () => {
    if (!selected.length) return;
    const confirm = window.confirm(`Permanently delete emails from ${selected.length} sender(s)? This cannot be undone!`);
    if (!confirm) return;
    setUnsubbing(true); setUnsubPct(0);
    const token = localStorage.getItem("gmail_token");
    const toDel = subs.filter(s => selected.includes(s.id));
    let done = 0;
    for (const sub of toDel) {
      try {
        await fetch(`${BACKEND}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ messageIds: sub.messageIds || [] })
        });
      } catch {}
      done++;
      setUnsubPct(Math.round((done / toDel.length) * 100));
    }
    setSubs(s => s.filter(x => !selected.includes(x.id)));
    setSelected([]); setUnsubbing(false); setDoneToast(true);
    setTimeout(() => setDoneToast(false), 3000);
  };

  const total = subs.reduce((a, b) => a + b.count, 0);
  const avatar = userEmail ? userEmail[0].toUpperCase() : "S";

  const topbar = {
    position:"sticky", top:0, zIndex:100, background:T.topbar,
    backdropFilter:"blur(24px) saturate(160%)", WebkitBackdropFilter:"blur(24px)",
    borderBottom:`1px solid ${T.line}`,
    padding:mobile?"11px 16px":"12px 28px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
  };

  const btnP = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"7px",
    padding:"9px 18px", border:"none", borderRadius:"9px",
    background:dark?"linear-gradient(135deg,#8B5CF6,#6D28D9)":"linear-gradient(135deg,#4F46E5,#4338CA)",
    color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:500,
    cursor:"pointer", transition:"all .18s",
  };

  const btnG = {
    display:"inline-flex", alignItems:"center", gap:"6px",
    padding:"7px 13px", border:`1px solid ${T.line2}`, borderRadius:"8px",
    background:"transparent", color:T.t2,
    fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:500,
    cursor:"pointer", transition:"all .15s",
  };

  const inp = {
    width:"100%", padding:"8px 12px 8px 34px",
    background:T.input, border:`1px solid ${T.inputBorder}`,
    borderRadius:"8px", color:T.t1,
    fontFamily:"'DM Sans',sans-serif", fontSize:"13px",
    outline:"none", transition:"border-color .15s",
  };

  // Filter button style
  const filterStyle = (key) => {
    const isOn = filter === key;
    const styles = {
      ALL:        { on:{ bg:"rgba(139,92,246,.14)", color:"#C4B5FD", border:"rgba(139,92,246,.28)", fc_bg:"rgba(139,92,246,.2)", fc_c:"#A78BFA" }, light:{ bg:"rgba(99,102,241,.1)", color:"#4F46E5", border:"rgba(99,102,241,.22)", fc_bg:"rgba(99,102,241,.14)", fc_c:"#4F46E5" } },
      NEWSLETTER: { on:{ bg:"rgba(59,130,246,.12)", color:"#93C5FD", border:"rgba(59,130,246,.25)", fc_bg:"rgba(59,130,246,.18)", fc_c:"#60A5FA" }, light:{ bg:"rgba(59,130,246,.09)", color:"#2563EB", border:"rgba(59,130,246,.2)", fc_bg:"rgba(59,130,246,.12)", fc_c:"#2563EB" } },
      PROMO:      { on:{ bg:"rgba(249,115,22,.12)", color:"#FDBA74", border:"rgba(249,115,22,.25)", fc_bg:"rgba(249,115,22,.18)", fc_c:"#FB923C" }, light:{ bg:"rgba(249,115,22,.09)", color:"#EA580C", border:"rgba(249,115,22,.2)", fc_bg:"rgba(249,115,22,.12)", fc_c:"#EA580C" } },
      SPAM:       { on:{ bg:"rgba(239,68,68,.1)",  color:"#FCA5A5", border:"rgba(239,68,68,.22)",  fc_bg:"rgba(239,68,68,.15)",  fc_c:"#F87171"  }, light:{ bg:"rgba(239,68,68,.07)",  color:"#DC2626", border:"rgba(239,68,68,.18)",  fc_bg:"rgba(239,68,68,.1)",   fc_c:"#DC2626"  } },
    };
    const s = styles[key];
    const mode = dark ? s.on : s.light;
    if (isOn) return { btn:{ background:mode.bg, color:mode.color, border:`1px solid ${mode.border}`, borderRadius:"7px", padding:"5px 12px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:500, display:"inline-flex", alignItems:"center", gap:"5px", transition:"all .15s" }, fc:{ background:mode.fc_bg, color:mode.fc_c, fontSize:"11px", padding:"1px 5px", borderRadius:"5px", fontWeight:600 } };
    return { btn:{ background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)", color:dark?"#666":"#999", border:`1px solid ${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.07)"}`, borderRadius:"7px", padding:"5px 12px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:500, display:"inline-flex", alignItems:"center", gap:"5px", transition:"all .15s" }, fc:{ background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.05)", color:dark?"#555":"#aaa", fontSize:"11px", padding:"1px 5px", borderRadius:"5px", fontWeight:600 } };
  };

  // Stat card style
  const statCard = (type) => {
    const configs = {
      snd: { bg:dark?"linear-gradient(135deg,rgba(139,92,246,.13),rgba(109,40,217,.06))":"linear-gradient(135deg,rgba(99,102,241,.07),rgba(139,92,246,.03))", border:dark?"rgba(139,92,246,.2)":"rgba(99,102,241,.18)", icon:dark?"rgba(139,92,246,.18)":"rgba(99,102,241,.12)", val:dark?"#C4B5FD":"#4F46E5" },
      wst: { bg:dark?"linear-gradient(135deg,rgba(239,68,68,.11),rgba(249,115,22,.05))":"linear-gradient(135deg,rgba(239,68,68,.05),rgba(249,115,22,.03))", border:dark?"rgba(239,68,68,.18)":"rgba(239,68,68,.14)", icon:dark?"rgba(239,68,68,.14)":"rgba(239,68,68,.1)", val:dark?"#FCA5A5":"#DC2626" },
      sel: { bg:dark?"linear-gradient(135deg,rgba(16,185,129,.11),rgba(5,150,105,.05))":"linear-gradient(135deg,rgba(5,150,105,.05),rgba(16,185,129,.03))", border:dark?"rgba(16,185,129,.18)":"rgba(5,150,105,.14)", icon:dark?"rgba(16,185,129,.14)":"rgba(16,185,129,.1)", val:dark?"#6EE7B7":"#059669" },
    };
    return configs[type];
  };

  // Loading Screen
  const LoadingView = () => {
    const steps = [
      { label:"Connecting to Gmail", at:10 },
      { label:"Reading your inbox", at:35 },
      { label:"Detecting subscriptions", at:65 },
      { label:"Categorising senders", at:85 },
    ];
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:mobile?"55vh":"380px", padding:mobile?"28px 16px":"48px 32px" }}>
        <div style={{ fontSize:mobile?"40px":"50px", marginBottom:"18px", animation:"float 2.5s ease-in-out infinite", display:"inline-block" }}>📬</div>
        <div style={{ fontSize:mobile?"17px":"21px", fontWeight:700, color:T.t1, marginBottom:"6px", textAlign:"center" }}>Scanning your Gmail...</div>
        <div style={{ fontSize:"13px", color:T.t3, marginBottom:"8px", textAlign:"center" }}>Finding all your subscriptions</div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:dark?"rgba(139,92,246,.1)":"rgba(79,70,229,.08)", border:`1px solid ${dark?"rgba(139,92,246,.2)":"rgba(79,70,229,.15)"}`, borderRadius:"100px", padding:"4px 12px", marginBottom:"28px" }}>
          <span style={{ fontSize:"11px" }}>⏱️</span>
          <span style={{ fontSize:"12px", color:dark?"#A78BFA":"#4F46E5", fontWeight:500 }}>This usually takes 10–20 seconds</span>
        </div>
        <div style={{ width:mobile?"100%":"340px", marginBottom:"8px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
            <span style={{ fontSize:"12px", color:T.t3 }}>Progress</span>
            <span style={{ fontSize:"14px", fontWeight:700, color:T.accent }}>{progress}%</span>
          </div>
          <div style={{ background:T.bg3, borderRadius:"100px", height:"8px", overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:"100px", background:`linear-gradient(90deg,${T.accent},${dark?"#A78BFA":T.blue})`, width:`${progress}%`, transition:"width .4s ease" }}/>
          </div>
        </div>
        <div style={{ width:mobile?"100%":"340px", display:"flex", flexDirection:"column", gap:"9px", marginTop:"18px" }}>
          {steps.map((step, i) => {
            const d = progress >= step.at;
            const active = d && progress < (steps[i+1]?.at ?? 101);
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", opacity:d?1:0.3, transition:"opacity .4s" }}>
                <div style={{ width:"20px", height:"20px", borderRadius:"50%", flexShrink:0, background:d?T.accent:T.bg3, border:`1.5px solid ${d?T.accent:T.line2}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s" }}>
                  {d ? <span style={{ color:"#fff", fontSize:"10px", fontWeight:700 }}>✓</span> : <span style={{ color:T.t3, fontSize:"9px" }}>{i+1}</span>}
                </div>
                <span style={{ fontSize:"13px", color:d?T.t1:T.t3, fontWeight:d?500:400, flex:1 }}>{step.label}</span>
                {active && <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:T.accent, animation:"pulseDot 1s ease infinite", flexShrink:0 }}/>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Settings Page
  const SettingsPage = () => (
    <div style={{ padding:mobile?"18px 14px 100px":"28px 36px", maxWidth:"600px" }}>
      <h1 style={{ fontSize:"22px", fontWeight:700, color:T.t1, marginBottom:"4px" }}>Settings</h1>
      <p style={{ fontSize:"13px", color:T.t3, marginBottom:"28px" }}>Manage your account and preferences</p>
      {[
        <div style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"13px", padding:"20px", marginBottom:"14px" }}>
          <div style={{ fontSize:"10px", fontWeight:600, color:T.t3, letterSpacing:".5px", textTransform:"uppercase", marginBottom:"14px" }}>Account</div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:getAvColor(userEmail?.split("@")[0]||"S"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", fontWeight:700, color:"#fff" }}>{avatar}</div>
            <div><div style={{ fontSize:"14px", fontWeight:600, color:T.t1 }}>{userEmail?userEmail.split("@")[0]:"User"}</div><div style={{ fontSize:"12px", color:T.t3 }}>{userEmail}</div></div>
          </div>
          <button onClick={logout} style={{ ...btnG, color:T.red, borderColor:"rgba(239,68,68,.3)", width:"100%", justifyContent:"center", padding:"10px" }}>🚪 Logout</button>
        </div>,
        <div style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"13px", padding:"20px", marginBottom:"14px" }}>
          <div style={{ fontSize:"10px", fontWeight:600, color:T.t3, letterSpacing:".5px", textTransform:"uppercase", marginBottom:"14px" }}>Your Stats</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            {[{ l:"Active Subscriptions",v:subs.length,i:"📧"},{l:"Emails Wasted",v:total.toLocaleString(),i:"📩"},{l:"Unsubscribed",v:history.length,i:"✅"},{l:"Emails Cleared",v:(history.reduce((a,b)=>a+(b.count||0),0)).toLocaleString(),i:"🎉"}].map((s,i)=>(
              <div key={i} style={{ background:T.bg2, borderRadius:"10px", padding:"12px" }}>
                <div style={{ fontSize:"20px", marginBottom:"4px" }}>{s.i}</div>
                <div style={{ fontSize:"18px", fontWeight:700, color:T.accent }}>{s.v}</div>
                <div style={{ fontSize:"11px", color:T.t3, marginTop:"2px" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>,
        <div style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"13px", padding:"20px", marginBottom:"14px" }}>
          <div style={{ fontSize:"10px", fontWeight:600, color:T.t3, letterSpacing:".5px", textTransform:"uppercase", marginBottom:"14px" }}>Actions</div>
          <button onClick={() => { setActivePage("subscriptions"); fetchData(); }} style={{ ...btnP, width:"100%", justifyContent:"center", marginBottom:"10px", padding:"11px" }}>🔄 Re-scan Gmail</button>
          <button onClick={() => { setHistory([]); localStorage.removeItem("unsub_history"); }} style={{ ...btnG, width:"100%", justifyContent:"center", padding:"10px", color:T.t3 }}>🗑️ Clear History</button>
        </div>,
        <div style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"13px", padding:"20px", marginBottom:"14px" }}>
          <div style={{ fontSize:"10px", fontWeight:600, color:T.t3, letterSpacing:".5px", textTransform:"uppercase", marginBottom:"14px" }}>Legal</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <button onClick={() => setModal("terms")} style={{ ...btnG, justifyContent:"space-between", padding:"11px 14px" }}><span>📄 Terms & Conditions</span><span style={{ color:T.t3 }}>→</span></button>
            <button onClick={() => setModal("privacy")} style={{ ...btnG, justifyContent:"space-between", padding:"11px 14px" }}><span>🔒 Privacy Policy</span><span style={{ color:T.t3 }}>→</span></button>
          </div>
        </div>,
        <div style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"13px", padding:"20px" }}>
          <div style={{ fontSize:"10px", fontWeight:600, color:T.t3, letterSpacing:".5px", textTransform:"uppercase", marginBottom:"14px" }}>About</div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}><Logo size={28} dark={dark}/><div><div style={{ fontSize:"14px", fontWeight:600, color:T.t1 }}>MailDetox</div><div style={{ fontSize:"11px", color:T.t3 }}>Version 1.0.0</div></div></div>
          <p style={{ fontSize:"12px", color:T.t3, lineHeight:1.6 }}>MailDetox helps you clean your Gmail inbox by detecting and removing unwanted newsletters and promotional emails.</p>
        </div>
      ]}
    </div>
  );

  const AnalyticsPage = () => (
    <div style={{ padding:mobile?"18px 14px 100px":"28px 36px", maxWidth:"700px" }}>
      <h1 style={{ fontSize:"22px", fontWeight:700, color:T.t1, marginBottom:"4px" }}>Analytics</h1>
      <p style={{ fontSize:"13px", color:T.t3, marginBottom:"24px" }}>Your unsubscribe history and inbox stats</p>
      <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr 1fr":"1fr 1fr 1fr", gap:"10px", marginBottom:"24px" }}>
        {[{ l:"Total Unsubscribed",v:history.length,c:dark?"#6EE7B7":T.green,i:"✅"},{l:"Emails Removed",v:(history.reduce((a,b)=>a+(b.count||0),0)).toLocaleString(),c:dark?"#C4B5FD":T.accent,i:"📩"},{l:"Active Subscriptions",v:subs.length,c:dark?"#7CB9FF":T.blue,i:"📧"}].map((s,i)=>(
          <div key={i} style={{ background:T.bg1, border:`1px solid ${T.line}`, borderRadius:"10px", padding:"14px", display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"20px" }}>{s.i}</span>
            <div><div style={{ fontSize:"18px", fontWeight:700, color:s.c, lineHeight:1 }}>{s.v}</div><div style={{ fontSize:"11px", color:T.t3, marginTop:"2px" }}>{s.l}</div></div>
          </div>
        ))}
      </div>
      <div style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"13px", padding:"20px" }}>
        <div style={{ fontSize:"10px", fontWeight:600, color:T.t3, letterSpacing:".5px", textTransform:"uppercase", marginBottom:"14px" }}>Unsubscribe History</div>
        {history.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ fontSize:"32px", marginBottom:"10px" }}>📭</div>
            <div style={{ fontSize:"14px", color:T.t3 }}>No unsubscribes yet</div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {history.map((h,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", background:T.bg2, borderRadius:"9px" }}>
                <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:getAvColor(h.sender), display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:700, color:"#fff", flexShrink:0 }}>{(h.sender||"?")[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"13px", fontWeight:500, color:T.t1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.sender}</div>
                  <div style={{ fontSize:"11px", color:T.t3 }}>{h.email}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:"11px", color:T.green, fontWeight:500 }}>✓ Unsubscribed</div>
                  <div style={{ fontSize:"11px", color:T.t3, marginTop:"2px" }}>{h.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ModalView = ({ type, onClose }) => {
    const isTerms = type === "terms";
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{ background:T.bg1, borderRadius:"16px", border:`1px solid ${T.line}`, padding:"28px", maxWidth:"560px", width:"100%", maxHeight:"80vh", overflow:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.4)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
            <h2 style={{ fontSize:"18px", fontWeight:700, color:T.t1 }}>{isTerms?"📄 Terms & Conditions":"🔒 Privacy Policy"}</h2>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:T.t3, fontSize:"20px", cursor:"pointer" }}>×</button>
          </div>
          {isTerms ? (
            <div style={{ fontSize:"13px", color:T.t2, lineHeight:1.8, display:"flex", flexDirection:"column", gap:"14px" }}>
              <p><strong style={{ color:T.t1 }}>1. Acceptance of Terms</strong><br/>By using MailDetox, you agree to these terms.</p>
              <p><strong style={{ color:T.t1 }}>2. Service Description</strong><br/>MailDetox provides Gmail inbox management by detecting subscriptions and facilitating unsubscription from unwanted emails.</p>
              <p><strong style={{ color:T.t1 }}>3. Google OAuth</strong><br/>We use Google OAuth for authentication. Read-only and modify access only. We never store your emails.</p>
              <p><strong style={{ color:T.t1 }}>4. User Responsibilities</strong><br/>Do not use MailDetox to unsubscribe from important emails.</p>
              <p><strong style={{ color:T.t1 }}>5. Limitation of Liability</strong><br/>MailDetox is provided as is. We are not liable for accidentally unsubscribed emails.</p>
              <p style={{ color:T.t3, fontSize:"12px" }}>Last updated: March 2026</p>
            </div>
          ) : (
            <div style={{ fontSize:"13px", color:T.t2, lineHeight:1.8, display:"flex", flexDirection:"column", gap:"14px" }}>
              <p><strong style={{ color:T.t1 }}>1. Data We Access</strong><br/>We read email headers only. Not the full email body.</p>
              <p><strong style={{ color:T.t1 }}>2. Data We Store</strong><br/>Only your access token in browser localStorage. Nothing on our servers.</p>
              <p><strong style={{ color:T.t1 }}>3. Data Sharing</strong><br/>We never sell or share your data. Ever.</p>
              <p><strong style={{ color:T.t1 }}>4. Security</strong><br/>All communication encrypted via HTTPS.</p>
              <p><strong style={{ color:T.t1 }}>5. Your Rights</strong><br/>Revoke access from Google Account settings or logout from MailDetox.</p>
              <p style={{ color:T.t3, fontSize:"12px" }}>Last updated: March 2026</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const navItems = [
    { icon:"📬", label:"Subscriptions", key:"subscriptions" },
    { icon:"📊", label:"Analytics",     key:"analytics" },
    { icon:"⚙️", label:"Settings",      key:"settings" },
  ];

  const navColors = {
    subscriptions: { icon:"rgba(139,92,246,.18)", active:"rgba(139,92,246,.1)", label:dark?"#C4B5FD":"#4F46E5", count_bg:"rgba(139,92,246,.2)", count_c:"#A78BFA" },
    analytics:     { icon:"rgba(59,130,246,.15)",  active:"rgba(59,130,246,.08)", label:dark?"#7CB9FF":"#2563EB", count_bg:"", count_c:"" },
    settings:      { icon:"rgba(249,115,22,.15)",  active:"rgba(249,115,22,.08)", label:dark?"#FBA66A":"#EA580C", count_bg:"", count_c:"" },
  };

  /* LANDING */
  if (screen === "landing") return (
    <div style={{ minHeight:"100vh", background:T.bg0, fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden", transition:"background .3s" }}>
      <style>{CSS}</style>
      {dark && <MeshBg/>}
      {!dark && <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 20% 10%,#EEF2FF 0%,transparent 50%),radial-gradient(ellipse at 80% 90%,#F0FDF4 0%,transparent 50%)" }}/>}
      {dark && !mobile && <div style={{ position:"fixed", left:mousePos.x-200, top:mousePos.y-200, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.06) 0%,transparent 70%)", pointerEvents:"none", zIndex:1, transition:"left .25s,top .25s" }}/>}

      <div style={{ ...topbar, zIndex:10 }} className="fu1">
        <div style={{ display:"flex", alignItems:"center", gap:"9px" }}><Logo size={28} dark={dark}/><span style={{ fontSize:"16px", fontWeight:700, color:T.t1, letterSpacing:"-.2px" }}>MailDetox</span></div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <ThemeToggle dark={dark} onToggle={() => setDark(d=>!d)}/>
          <button style={btnP} onClick={startLogin}>Get started free →</button>
        </div>
      </div>

      <div style={{ maxWidth:"820px", margin:"0 auto", padding:mobile?"56px 20px 60px":"100px 40px 80px", position:"relative", zIndex:2 }}>
        <div className="fu2" style={{ marginBottom:"24px" }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:dark?"rgba(139,92,246,.12)":"rgba(79,70,229,.08)", border:dark?"1px solid rgba(139,92,246,.25)":"1px solid rgba(79,70,229,.2)", borderRadius:"100px", padding:"5px 14px", fontSize:"12px", fontWeight:500, color:dark?"#A78BFA":"#4F46E5" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:dark?"#8B5CF6":"#4F46E5", display:"inline-block", animation:"pulseDot 2s ease infinite" }}/>
            The inbox cleaner Unroll.me never built
          </span>
        </div>
        <div className="fu3" style={{ marginBottom:"26px" }}>
          <h1 style={{ fontSize:mobile?"34px":"68px", fontWeight:700, color:T.t1, lineHeight:1.06, letterSpacing:mobile?"-1px":"-2.5px", marginBottom:"22px", maxWidth:"720px" }}>
            Your inbox.<br/>
            <span style={dark?{ background:"linear-gradient(135deg,#C4B5FD,#8B5CF6,#6D28D9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", backgroundSize:"200% 200%", animation:"gradShift 4s ease infinite" }:{ color:"#4F46E5" }}>Finally clean.</span>
          </h1>
          <p style={{ fontSize:mobile?"16px":"19px", color:T.t2, lineHeight:1.72, maxWidth:"560px" }}>100+ useless emails every day? Connect Gmail, see every subscription at a glance, and unsubscribe in one click. Works worldwide.</p>
        </div>
        <div className="fu4" style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"36px" }}>
          {["✅ Free forever","🔒 Read-only access","⚡ One-click unsubscribe","🌍 Works worldwide"].map((t,i) => (
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:"5px", background:dark?"rgba(255,255,255,.05)":T.bg2, border:`1px solid ${T.line}`, borderRadius:"100px", padding:"6px 13px", fontSize:"12px", fontWeight:500, color:T.t2 }}>{t}</span>
          ))}
        </div>
        <div className="fu5" style={{ maxWidth:"420px", marginBottom:"60px" }}>
          {scanning ? (
            <div style={{ background:T.card, border:dark?"1px solid rgba(139,92,246,.3)":`1px solid ${T.cardBorder}`, borderRadius:"13px", padding:"22px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg,transparent,${T.accent},transparent)`, animation:"scanMove 1.8s ease-in-out infinite" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                <div style={{ animation:"float 2s ease-in-out infinite" }}><Logo size={22} dark={dark}/></div>
                <span style={{ fontSize:"14px", fontWeight:500, color:T.t1 }}>{scanMsg}</span>
              </div>
              <div style={{ background:T.bg3, borderRadius:"4px", height:"3px", overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:"4px", background:`linear-gradient(90deg,${T.accent},${dark?"#A78BFA":T.blue})`, width:`${scanPct}%`, transition:"width .2s ease" }}/>
              </div>
              <p style={{ marginTop:"10px", fontSize:"11px", color:T.t3 }}>Read-only · Your data never leaves Google</p>
            </div>
          ) : (
            <>
              <button style={{ ...btnP, width:"100%", padding:"14px 24px", fontSize:"15px", borderRadius:"11px", marginBottom:"11px" }} onClick={startLogin}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google — It's free
              </button>
              <p style={{ textAlign:"center", fontSize:"12px", color:T.t3 }}>No credit card · No data selling · Cancel anytime</p>
            </>
          )}
        </div>
        <div className="fu5" style={{ display:"grid", gridTemplateColumns:mobile?"1fr 1fr":"1fr 1fr 1fr", gap:"12px", marginBottom:"64px" }}>
          {[{ num:"12K+",label:"Emails cleaned",color:dark?"#C4B5FD":"#4F46E5"},{ num:"4.9★",label:"Average rating",color:dark?"#FCD34D":"#F59E0B"},{ num:"Free",label:"Basic plan forever",color:dark?"#6EE7B7":T.green}].map((s,i) => (
            <div key={i} style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"13px", padding:mobile?"16px 12px":"22px 18px", textAlign:"center" }}>
              <div style={{ fontSize:mobile?"24px":"28px", fontWeight:700, color:s.color, letterSpacing:"-.5px", marginBottom:"5px" }}>{s.num}</div>
              <div style={{ fontSize:"12px", color:T.t3 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="fu6">
          <h2 style={{ fontSize:mobile?"20px":"24px", fontWeight:700, color:T.t1, letterSpacing:"-.4px", marginBottom:"5px" }}>How it works</h2>
          <p style={{ fontSize:"14px", color:T.t3, marginBottom:"20px" }}>Three steps. No setup. Works in minutes.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {[{ icon:"🔐",n:"01",title:"Connect Gmail",desc:"One-click Google OAuth. Read-only. We never store your emails.",c:dark?"rgba(139,92,246,.15)":"rgba(79,70,229,.08)"},{ icon:"📋",n:"02",title:"Review Senders",desc:"Every newsletter, promo and subscription listed by sender and count.",c:dark?"rgba(59,130,246,.15)":"rgba(16,185,129,.08)"},{ icon:"🗑️",n:"03",title:"Unsubscribe",desc:"Select individually or all at once. Gone permanently in one click.",c:dark?"rgba(16,185,129,.15)":"rgba(249,115,22,.08)"}].map((s,i) => (
              <div key={i} style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"13px", padding:mobile?"14px 16px":"18px 20px", display:"flex", alignItems:"flex-start", gap:"14px" }}>
                <div style={{ width:"38px", height:"38px", borderRadius:"10px", background:s.c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                    <span style={{ fontSize:"10px", fontWeight:600, color:T.t3, letterSpacing:".5px" }}>{s.n}</span>
                    <span style={{ fontSize:"14px", fontWeight:600, color:T.t1 }}>{s.title}</span>
                  </div>
                  <p style={{ fontSize:"13px", color:T.t2, lineHeight:1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop:"56px", paddingTop:"20px", borderTop:`1px solid ${T.line}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><Logo size={18} dark={dark}/><span style={{ fontSize:"13px", color:T.t3 }}>MailDetox</span></div>
          <div style={{ display:"flex", gap:"16px" }}>
            <button onClick={() => setModal("terms")} style={{ background:"none", border:"none", fontSize:"12px", color:T.t3, cursor:"pointer" }}>Terms</button>
            <button onClick={() => setModal("privacy")} style={{ background:"none", border:"none", fontSize:"12px", color:T.t3, cursor:"pointer" }}>Privacy</button>
          </div>
        </div>
      </div>
      {modal && <ModalView type={modal} onClose={() => setModal(null)}/>}
    </div>
  );

  /* DASHBOARD */
  return (
    <div style={{ minHeight:"100vh", background:T.bg0, fontFamily:"'DM Sans',sans-serif", color:T.t2, transition:"background .3s" }}>
      <style>{CSS}</style>
      {dark && <MeshBg/>}
      {!dark && <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 80% 5%,#EEF2FF 0%,transparent 40%)" }}/>}
      {modal && <ModalView type={modal} onClose={() => setModal(null)}/>}

      <div style={{ display:"flex", minHeight:"100vh", position:"relative", zIndex:1 }}>

        {/* SIDEBAR */}
        {!mobile && (
          <div className="sidebar" style={{ width:"220px", flexShrink:0, borderRight:`1px solid ${T.line}`, padding:"14px 10px", display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", overflowY:"auto", background:T.sidebar }}>
            <div style={{ display:"flex", alignItems:"center", gap:"9px", padding:"8px 8px 18px" }}>
              <Logo size={24} dark={dark}/>
              <span style={{ fontSize:"14px", fontWeight:700, color:T.t1, letterSpacing:"-.2px" }}>MailDetox</span>
            </div>
            <div style={{ height:"1px", background:T.line, marginBottom:"10px" }}/>
            {navItems.map((n,i) => {
              const nc = navColors[n.key];
              const isActive = activePage === n.key;
              return (
                <div key={i} onClick={() => setActivePage(n.key)} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"7px 10px", borderRadius:"8px", background:isActive?nc.active:"transparent", cursor:"pointer", transition:"all .15s", marginBottom:"2px" }}>
                  <div style={{ width:"30px", height:"30px", borderRadius:"7px", background:nc.icon, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>{n.icon}</div>
                  <span style={{ fontSize:"13px", fontWeight:500, color:isActive?nc.label:T.t3, flex:1 }}>{n.label}</span>
                  {n.key==="subscriptions" && <span style={{ fontSize:"11px", fontWeight:600, padding:"1px 6px", borderRadius:"6px", background:nc.count_bg, color:nc.count_c }}>{subs.length}</span>}
                </div>
              );
            })}
            <div style={{ marginTop:"auto" }}>
              <div style={{ height:"1px", background:T.line, marginBottom:"8px" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px" }}>
                <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:getAvColor(userEmail?.split("@")[0]||"S"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:700, color:"#fff", flexShrink:0 }}>{avatar}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"12px", fontWeight:500, color:T.t1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userEmail?userEmail.split("@")[0]:"User"}</div>
                  <div style={{ fontSize:"11px", color:T.t3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userEmail||"Loading..."}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ flex:1, minWidth:0 }}>
          {/* Mobile topbar */}
          {mobile && (
            <div style={topbar}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><Logo size={24} dark={dark}/><span style={{ fontSize:"15px", fontWeight:700, color:T.t1 }}>MailDetox</span></div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <ThemeToggle dark={dark} onToggle={() => setDark(d=>!d)}/>
                <div style={{ position:"relative" }} onClick={e => { e.stopPropagation(); setShowUserMenu(m=>!m); }}>
                  <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:getAvColor(userEmail?.split("@")[0]||"S"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:700, color:"#fff", cursor:"pointer" }}>{avatar}</div>
                  {showUserMenu && (
                    <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", top:"calc(100% + 10px)", right:0, background:dark?"#1C1C1E":"#fff", border:`1px solid ${T.line2}`, borderRadius:"12px", padding:"6px", minWidth:"200px", boxShadow:"0 8px 32px rgba(0,0,0,.5)", zIndex:999 }}>
                      <div style={{ padding:"8px 10px 10px", borderBottom:`1px solid ${T.line}`, marginBottom:"4px" }}>
                        <div style={{ fontSize:"12px", fontWeight:600, color:T.t1 }}>{userEmail?userEmail.split("@")[0]:"User"}</div>
                        <div style={{ fontSize:"11px", color:T.t3, marginTop:"1px" }}>{userEmail}</div>
                      </div>
                      <div onClick={()=>{ setShowUserMenu(false); setActivePage("settings"); }} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", borderRadius:"7px", cursor:"pointer", fontSize:"13px", fontWeight:500, color:T.t1 }} onMouseEnter={e=>e.currentTarget.style.background=T.bg2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        ⚙️ Settings
                      </div>
                      <div onClick={()=>{ setShowUserMenu(false); logout(); }} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", borderRadius:"7px", cursor:"pointer", fontSize:"13px", fontWeight:500, color:T.red }} onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(239,68,68,.1)":"rgba(239,68,68,.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        🚪 Logout
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Desktop topbar */}
          {!mobile && (
            <div style={{ ...topbar }}>
              <span style={{ fontSize:"15px", fontWeight:600, color:T.t1, textTransform:"capitalize" }}>{activePage}</span>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <ThemeToggle dark={dark} onToggle={() => setDark(d=>!d)}/>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"10px", color:T.t3, letterSpacing:".2px" }}>LOGGED IN AS</div>
                  <div style={{ fontSize:"12px", fontWeight:500, color:T.t1 }}>{userEmail||"Loading..."}</div>
                </div>
                <div style={{ position:"relative" }} onClick={e => { e.stopPropagation(); setShowUserMenu(m=>!m); }}>
                  <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:getAvColor(userEmail?.split("@")[0]||"S"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:700, color:"#fff", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,.3)" }}>{avatar}</div>
                  {showUserMenu && (
                    <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", top:"calc(100% + 10px)", right:0, background:dark?"#1C1C1E":"#fff", border:`1px solid ${T.line2}`, borderRadius:"12px", padding:"6px", minWidth:"200px", boxShadow:"0 8px 32px rgba(0,0,0,.5)", zIndex:999 }}>
                      <div style={{ padding:"8px 10px 10px", borderBottom:`1px solid ${T.line}`, marginBottom:"4px" }}>
                        <div style={{ fontSize:"12px", fontWeight:600, color:T.t1 }}>{userEmail?userEmail.split("@")[0]:"User"}</div>
                        <div style={{ fontSize:"11px", color:T.t3, marginTop:"1px" }}>{userEmail}</div>
                      </div>
                      <div onClick={()=>{ setShowUserMenu(false); setActivePage("settings"); }} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", borderRadius:"7px", cursor:"pointer", fontSize:"13px", fontWeight:500, color:T.t1 }} onMouseEnter={e=>e.currentTarget.style.background=T.bg2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        ⚙️ Settings
                      </div>
                      <div onClick={()=>{ setShowUserMenu(false); logout(); }} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", borderRadius:"7px", cursor:"pointer", fontSize:"13px", fontWeight:500, color:T.red }} onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(239,68,68,.1)":"rgba(239,68,68,.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        🚪 Logout
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Page routing */}
          {activePage === "settings" ? <SettingsPage/> :
           activePage === "analytics" ? <AnalyticsPage/> : (
            <div style={{ padding:mobile?"18px 14px 110px":"24px 32px 90px", maxWidth:"900px" }}>
              {!mobile && (
                <div style={{ marginBottom:"20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <h1 style={{ fontSize:"24px", fontWeight:700, color:T.t1, letterSpacing:"-.4px", marginBottom:"2px" }}>Subscriptions</h1>
                    <p style={{ fontSize:"12px", color:T.t3 }}>Manage and clean your email subscriptions</p>
                  </div>
                  <button onClick={() => fetchData()} style={btnG}>🔄 Re-scan</button>
                </div>
              )}

              {/* STAT CARDS */}
              <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr 1fr":"1fr 1fr 1fr", gap:"10px", marginBottom:"18px" }}>
                {[
                  { type:"snd", label:"Total Senders", value:subs.length, icon:"📧" },
                  { type:"wst", label:"Emails Wasted", value:total.toLocaleString(), icon:"📩" },
                  { type:"sel", label:"Selected", value:selected.length, icon:"✓" },
                ].map((s,i) => {
                  const sc = statCard(s.type);
                  return (
                    <div key={i} style={{ borderRadius:"12px", padding:mobile?"11px 13px":"14px 16px", display:"flex", alignItems:"center", gap:"12px", background:sc.bg, border:`1px solid ${sc.border}` }}>
                      <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:sc.icon, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", flexShrink:0 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize:mobile?"17px":"20px", fontWeight:700, letterSpacing:"-.4px", lineHeight:1, color:sc.val }}>{s.value}</div>
                        <div style={{ fontSize:"11px", color:T.t3, marginTop:"2px" }}>{s.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SEARCH */}
              <div style={{ position:"relative", marginBottom:"10px" }}>
                <span style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", fontSize:"13px", color:T.t3, pointerEvents:"none" }}>🔍</span>
                <input style={inp} placeholder="Filter by sender or email..." value={query} onChange={e=>setQuery(e.target.value)}
                  onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.inputBorder}/>
              </div>

              {/* FILTER TABS */}
              <div style={{ display:"flex", gap:"5px", marginBottom:"14px", alignItems:"center", flexWrap:"wrap" }}>
                {[{k:"ALL",l:"All"},{k:"NEWSLETTER",l:"Newsletter"},{k:"PROMO",l:"Promo"},{k:"SPAM",l:"Spam"}].map(f => {
                  const fs = filterStyle(f.k);
                  return (
                    <button key={f.k} onClick={() => setFilter(f.k)} style={fs.btn}>
                      {f.l}
                      <span style={fs.fc}>
                        {f.k==="ALL"?subs.length:subs.filter(s=>s.category===f.k).length}
                      </span>
                    </button>
                  );
                })}
                <button onClick={toggleAll} style={{ marginLeft:"auto", background:"transparent", border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:500, color:allSel?T.red:T.t3, cursor:"pointer" }}>
                  {allSel?"Deselect all":"Select all"}
                </button>
              </div>

              {/* COL HEADERS */}
              {!mobile && (
                <>
                  <div className="col-hdr" style={{ display:"grid", gridTemplateColumns:"20px 36px 1fr 110px 65px 80px", gap:"8px", padding:"3px 12px 8px" }}>
                    {["","","Sender","Category","Emails","Last seen"].map((h,i) => (
                      <div key={i} style={{ fontSize:"10px", fontWeight:600, color:T.t3, letterSpacing:".5px", textTransform:"uppercase" }}>{h}</div>
                    ))}
                  </div>
                  <div className="col-div" style={{ height:"1px", background:T.line, marginBottom:"4px" }}/>
                </>
              )}

              {/* LIST */}
              <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                {loading ? <LoadingView/> :
                 filtered.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 0" }}>
                    <div style={{ fontSize:"40px", marginBottom:"12px" }}>✓</div>
                    <div style={{ fontSize:"16px", fontWeight:600, color:T.t1, marginBottom:"5px" }}>Inbox is spotless</div>
                    <div style={{ fontSize:"13px", color:T.t3 }}>No subscriptions found</div>
                  </div>
                ) : filtered.map((sub, idx) => {
                  const sel = selected.includes(sub.id);
                  const catData = CAT[sub.category] || CAT.NEWSLETTER;
                  const avBg = getAvColor(sub.sender);
                  return mobile ? (
                    <div key={sub.id} onClick={() => toggle(sub.id)}
                      style={{ display:"grid", gridTemplateColumns:"20px 36px 1fr auto", gap:"10px", alignItems:"center", padding:"10px 12px", borderRadius:"9px", cursor:"pointer", background:sel?T.rowSel:"transparent", border:`1px solid ${sel?(dark?"rgba(139,92,246,.18)":"rgba(99,102,241,.15)"):"transparent"}`, transition:"background .1s", animation:`slideIn .28s ${idx*.022}s both` }}>
                      {/* Checkbox */}
                      <div style={{ width:"17px", height:"17px", borderRadius:"5px", border:`1.5px solid ${sel?(dark?"#8B5CF6":"#4F46E5"):T.chkBorder}`, background:sel?(dark?"#8B5CF6":"#4F46E5"):"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .15s" }}>
                        {sel && <span style={{ color:"#fff", fontSize:"10px", fontWeight:800 }}>✓</span>}
                      </div>
                      {/* Avatar */}
                      <div style={{ width:"34px", height:"34px", borderRadius:"8px", background:avBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:700, color:"#fff", flexShrink:0, boxShadow:"0 2px 6px rgba(0,0,0,.25)" }}>
                        {sub.sender[0]}
                      </div>
                      {/* Name + email */}
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:"13px", fontWeight:500, color:T.t1, marginBottom:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.sender}</div>
                        <div style={{ fontSize:"11px", color:T.t3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.email}</div>
                      </div>
                      {/* Mobile right: dot + count */}
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
                        <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:catData.dot, flexShrink:0 }}/>
                        <span style={{ fontSize:"13px", fontWeight:600, color:T.t2 }}>{sub.count}</span>
                      </div>
                    </div>
                  ) : (
                    <div key={sub.id} onClick={() => toggle(sub.id)}
                      style={{ display:"grid", gridTemplateColumns:"20px 36px 1fr 110px 65px 80px", gap:"8px", alignItems:"center", padding:"9px 12px", borderRadius:"9px", cursor:"pointer", background:sel?T.rowSel:"transparent", border:`1px solid ${sel?(dark?"rgba(139,92,246,.18)":"rgba(99,102,241,.15)"):"transparent"}`, transition:"background .1s", animation:`slideIn .28s ${idx*.022}s both` }}
                      onMouseEnter={e=>{ if(!sel) e.currentTarget.style.background=T.rowHover; }}
                      onMouseLeave={e=>{ if(!sel) e.currentTarget.style.background="transparent"; }}>
                      {/* Checkbox */}
                      <div style={{ width:"17px", height:"17px", borderRadius:"5px", border:`1.5px solid ${sel?(dark?"#8B5CF6":"#4F46E5"):T.chkBorder}`, background:sel?(dark?"#8B5CF6":"#4F46E5"):"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .15s" }}>
                        {sel && <span style={{ color:"#fff", fontSize:"10px", fontWeight:800 }}>✓</span>}
                      </div>
                      {/* Avatar */}
                      <div style={{ width:"34px", height:"34px", borderRadius:"8px", background:avBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:700, color:"#fff", flexShrink:0, boxShadow:"0 2px 6px rgba(0,0,0,.25)" }}>
                        {sub.sender[0]}
                      </div>
                      {/* Name + email */}
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:"13px", fontWeight:500, color:T.t1, marginBottom:"1px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.sender}</div>
                        <div style={{ fontSize:"11px", color:T.t3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sub.email}</div>
                      </div>
                      {/* Category */}
                      <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                        <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:catData.dot, flexShrink:0 }}/>
                        <span style={{ fontSize:"12px", color:T.t2 }}>{catData.label}</span>
                      </div>
                      <div style={{ fontSize:"13px", fontWeight:600, color:T.t2 }}>{sub.count}</div>
                      <div style={{ fontSize:"11px", color:T.t3 }}>{sub.last}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mobile bottom nav */}
          {mobile && (
            <div style={{ position:"fixed", bottom:0, left:0, right:0, background:T.topbar, backdropFilter:"blur(24px)", borderTop:`1px solid ${T.line}`, display:"flex", zIndex:150 }}>
              {navItems.map((n,i) => {
                const nc = navColors[n.key];
                const isActive = activePage === n.key;
                return (
                  <button key={i} onClick={() => setActivePage(n.key)} style={{ flex:1, padding:"10px 0 13px", display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", background:"transparent", border:"none", cursor:"pointer" }}>
                    <span style={{ fontSize:"20px" }}>{n.icon}</span>
                    <span style={{ fontSize:"10px", fontWeight:500, color:isActive?nc.label:T.t3 }}>{n.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      {selected.length > 0 && !doneToast && !unsubbing && (
        <div style={{ position:"fixed", bottom:mobile?"70px":"22px", left:"50%", transform:"translateX(-50%)", zIndex:200, animation:"popIn .18s ease" }}>
          <div style={{ background:T.fabBg, border:`1px solid ${T.fabBorder}`, borderRadius:"12px", padding:"9px 14px", display:"flex", alignItems:"center", gap:"10px", boxShadow:`0 8px 40px rgba(0,0,0,${dark?.6:.15})`, whiteSpace:"nowrap", backdropFilter:"blur(12px)" }}>
            <span style={{ fontSize:"13px", color:dark?"rgba(255,255,255,.5)":"rgba(255,255,255,.6)" }}>{selected.length} selected</span>
            <div style={{ width:"1px", height:"14px", background:dark?"rgba(255,255,255,.1)":"rgba(255,255,255,.2)" }}/>
            {/* Unsubscribe — spam mein jaata hai, future emails bhi block */}
            <button onClick={doUnsub} style={{ padding:"7px 14px", border:"none", borderRadius:"7px", background:"linear-gradient(135deg,#8B5CF6,#6D28D9)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
              🚫 Unsubscribe
            </button>
            {/* Permanent Delete — seedha delete, storage free */}
            <button onClick={doDelete} style={{ padding:"7px 14px", border:"none", borderRadius:"7px", background:"linear-gradient(135deg,#EF4444,#DC2626)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
              🗑️ Delete
            </button>
            <button onClick={() => setSelected([])} style={{ background:"transparent", color:dark?"rgba(255,255,255,.35)":"rgba(255,255,255,.5)", border:"none", fontSize:"18px", cursor:"pointer", padding:"2px 4px", lineHeight:1 }}>×</button>
          </div>
        </div>
      )}

      {unsubbing && (
        <div style={{ position:"fixed", bottom:mobile?"70px":"22px", left:"50%", transform:"translateX(-50%)", zIndex:200, animation:"popIn .18s ease", width:mobile?"calc(100% - 28px)":"300px" }}>
          <div style={{ background:T.fabBg, border:`1px solid ${T.fabBorder}`, borderRadius:"12px", padding:"14px 16px", boxShadow:`0 8px 40px rgba(0,0,0,${dark?.6:.15})` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
              <span style={{ fontSize:"13px", color:dark?"#fff":T.t1, fontWeight:500 }}>Unsubscribing...</span>
              <span style={{ fontSize:"12px", color:dark?"rgba(255,255,255,.4)":T.t3 }}>{Math.round(unsubPct)}%</span>
            </div>
            <div style={{ background:dark?T.bg3:T.bg2, borderRadius:"3px", height:"3px", overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:"3px", background:`linear-gradient(90deg,${T.accent},${dark?"#A78BFA":T.blue})`, width:`${unsubPct}%`, transition:"width .12s ease" }}/>
            </div>
          </div>
        </div>
      )}

      {doneToast && (
        <div style={{ position:"fixed", bottom:mobile?"70px":"22px", left:"50%", transform:"translateX(-50%)", zIndex:200, animation:"popIn .18s ease" }}>
          <div style={{ background:T.fabBg, border:`1px solid ${dark?"rgba(16,185,129,.3)":"rgba(5,150,105,.2)"}`, borderRadius:"12px", padding:"10px 18px", boxShadow:`0 8px 40px rgba(0,0,0,${dark?.6:.15})`, display:"flex", alignItems:"center", gap:"8px", whiteSpace:"nowrap" }}>
            <span style={{ color:T.green, fontSize:"14px", fontWeight:700 }}>✓</span>
            <span style={{ fontSize:"13px", color:dark?"#fff":T.t1, fontWeight:500 }}>Unsubscribed successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}