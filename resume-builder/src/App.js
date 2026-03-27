import { useState, useRef } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const T = {
  bg0: "#0F0F10", bg1: "#141415", bg2: "#1C1C1E", bg3: "#242426",
  line: "rgba(255,255,255,.07)", t1: "#FFFFFF", t2: "#A0A0A8", t3: "#555560",
  accent: "#8B5CF6", accent2: "#7C3AED", green: "#10B981", red: "#EF4444",
  input: "rgba(255,255,255,.04)", inputBorder: "rgba(255,255,255,.09)",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${T.bg0}; color: ${T.t1}; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${T.bg3}; border-radius: 2px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .fadeUp { animation: fadeUp .35s both; }
  input, textarea { outline: none; font-family: inherit; }
  input::placeholder, textarea::placeholder { color: ${T.t3}; }
  @media print {
    body { background: white !important; }
    .no-print { display: none !important; }
    .print-area { box-shadow: none !important; border: none !important; width: 100% !important; max-width: 100% !important; }
  }
`;

// ─── Default Data ─────────────────────────────────────────────────────────────
const DEFAULT = {
  personal: { name: "", title: "", email: "", phone: "", location: "", linkedin: "", website: "" },
  summary: "",
  experience: [{ id: 1, company: "", role: "", start: "", end: "", current: false, desc: "" }],
  education: [{ id: 1, school: "", degree: "", field: "", year: "", gpa: "" }],
  skills: "",
  template: "modern",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
let nextId = 100;
const uid = () => ++nextId;

function Inp({ label, value, onChange, placeholder, type = "text", small }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: T.t3, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ""}
        style={{
          background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 8,
          padding: small ? "6px 10px" : "9px 12px", color: T.t1, fontSize: small ? 13 : 14,
          transition: "border .15s",
        }}
        onFocus={e => e.target.style.borderColor = T.accent}
        onBlur={e => e.target.style.borderColor = T.inputBorder}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: T.t3, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 8,
          padding: "9px 12px", color: T.t1, fontSize: 14, resize: "vertical", lineHeight: 1.6,
          transition: "border .15s",
        }}
        onFocus={e => e.target.style.borderColor = T.accent}
        onBlur={e => e.target.style.borderColor = T.inputBorder}
      />
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="fadeUp" style={{
      background: T.bg1, border: `1px solid ${T.line}`, borderRadius: 14,
      padding: "20px 20px", marginBottom: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent", border: `1px dashed ${T.accent}`, color: T.accent,
      borderRadius: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 6, marginTop: 10,
    }}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> {label}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "rgba(239,68,68,.1)", border: "none", color: T.red,
      borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer",
    }}>Remove</button>
  );
}

// ─── Editor Sections ──────────────────────────────────────────────────────────
function PersonalSection({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <SectionCard title="Personal Info">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1/-1" }}><Inp label="Full Name" value={data.name} onChange={v => f("name", v)} placeholder="Rahul Sharma" /></div>
        <div style={{ gridColumn: "1/-1" }}><Inp label="Professional Title" value={data.title} onChange={v => f("title", v)} placeholder="Full Stack Developer" /></div>
        <Inp label="Email" value={data.email} onChange={v => f("email", v)} placeholder="rahul@gmail.com" />
        <Inp label="Phone" value={data.phone} onChange={v => f("phone", v)} placeholder="+91 98765 43210" />
        <Inp label="Location" value={data.location} onChange={v => f("location", v)} placeholder="Mumbai, India" />
        <Inp label="LinkedIn" value={data.linkedin} onChange={v => f("linkedin", v)} placeholder="linkedin.com/in/rahul" />
        <div style={{ gridColumn: "1/-1" }}><Inp label="Website / Portfolio" value={data.website} onChange={v => f("website", v)} placeholder="rahulsharma.dev" /></div>
      </div>
    </SectionCard>
  );
}

function SummarySection({ data, onChange }) {
  return (
    <SectionCard title="Professional Summary">
      <TextArea
        value={data}
        onChange={onChange}
        placeholder="Write 2-3 lines about yourself — your experience, skills, and what you bring to the table..."
        rows={4}
      />
    </SectionCard>
  );
}

function ExperienceSection({ data, onChange }) {
  const update = (id, key, val) => onChange(data.map(e => e.id === id ? { ...e, [key]: val } : e));
  const add = () => onChange([...data, { id: uid(), company: "", role: "", start: "", end: "", current: false, desc: "" }]);
  const remove = id => onChange(data.filter(e => e.id !== id));
  return (
    <SectionCard title="Work Experience">
      {data.map((exp, idx) => (
        <div key={exp.id} style={{ borderBottom: idx < data.length - 1 ? `1px solid ${T.line}` : "none", paddingBottom: idx < data.length - 1 ? 16 : 0, marginBottom: idx < data.length - 1 ? 16 : 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <Inp label="Company" value={exp.company} onChange={v => update(exp.id, "company", v)} placeholder="Google" />
            <Inp label="Role / Title" value={exp.role} onChange={v => update(exp.id, "role", v)} placeholder="Software Engineer" />
            <Inp label="Start Date" value={exp.start} onChange={v => update(exp.id, "start", v)} placeholder="Jan 2022" small />
            <Inp label="End Date" value={exp.end} onChange={v => update(exp.id, "end", v)} placeholder={exp.current ? "Present" : "Dec 2023"} small />
          </div>
          <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={exp.current} onChange={e => { update(exp.id, "current", e.target.checked); update(exp.id, "end", e.target.checked ? "Present" : ""); }} id={"cur" + exp.id} style={{ accentColor: T.accent }} />
            <label htmlFor={"cur" + exp.id} style={{ fontSize: 13, color: T.t2, cursor: "pointer" }}>Currently working here</label>
          </div>
          <TextArea value={exp.desc} onChange={v => update(exp.id, "desc", v)} placeholder="• Built scalable APIs using Node.js&#10;• Reduced load time by 40%&#10;• Led a team of 3 developers" rows={3} />
          {data.length > 1 && <div style={{ marginTop: 8 }}><RemoveBtn onClick={() => remove(exp.id)} /></div>}
        </div>
      ))}
      <AddBtn onClick={add} label="Add Experience" />
    </SectionCard>
  );
}

function EducationSection({ data, onChange }) {
  const update = (id, key, val) => onChange(data.map(e => e.id === id ? { ...e, [key]: val } : e));
  const add = () => onChange([...data, { id: uid(), school: "", degree: "", field: "", year: "", gpa: "" }]);
  const remove = id => onChange(data.filter(e => e.id !== id));
  return (
    <SectionCard title="Education">
      {data.map((edu, idx) => (
        <div key={edu.id} style={{ borderBottom: idx < data.length - 1 ? `1px solid ${T.line}` : "none", paddingBottom: idx < data.length - 1 ? 16 : 0, marginBottom: idx < data.length - 1 ? 16 : 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
            <Inp label="School / University" value={edu.school} onChange={v => update(edu.id, "school", v)} placeholder="IIT Bombay" />
            <Inp label="Degree" value={edu.degree} onChange={v => update(edu.id, "degree", v)} placeholder="B.Tech" />
            <Inp label="Field of Study" value={edu.field} onChange={v => update(edu.id, "field", v)} placeholder="Computer Science" />
            <Inp label="Graduation Year" value={edu.year} onChange={v => update(edu.id, "year", v)} placeholder="2024" small />
          </div>
          {data.length > 1 && <div style={{ marginTop: 8 }}><RemoveBtn onClick={() => remove(edu.id)} /></div>}
        </div>
      ))}
      <AddBtn onClick={add} label="Add Education" />
    </SectionCard>
  );
}

function SkillsSection({ data, onChange }) {
  return (
    <SectionCard title="Skills">
      <TextArea
        value={data}
        onChange={onChange}
        placeholder="React, Node.js, Python, MongoDB, Git, Figma, AWS..."
        rows={3}
      />
      <div style={{ fontSize: 11, color: T.t3, marginTop: 6 }}>Comma separated skills</div>
    </SectionCard>
  );
}

// ─── Resume Preview Templates ─────────────────────────────────────────────────
function ModernTemplate({ data }) {
  const { personal: p, summary, experience, education, skills } = data;
  const skillList = skills.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <div className="print-area" style={{
      fontFamily: "'Inter', sans-serif", background: "white", color: "#111",
      width: "100%", minHeight: "297mm", padding: "40px 44px", fontSize: 13, lineHeight: 1.6,
    }}>
      {/* Header */}
      <div style={{ borderBottom: "3px solid #8B5CF6", paddingBottom: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#111", letterSpacing: "-.02em" }}>{p.name || "Your Name"}</div>
        <div style={{ fontSize: 15, color: "#8B5CF6", fontWeight: 500, marginTop: 2 }}>{p.title || "Your Title"}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", marginTop: 10, fontSize: 12, color: "#555" }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📱 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: 22 }}>
          <SectionTitle label="Summary" />
          <p style={{ color: "#333", lineHeight: 1.7 }}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.some(e => e.company || e.role) && (
        <div style={{ marginBottom: 22 }}>
          <SectionTitle label="Experience" />
          {experience.filter(e => e.company || e.role).map(exp => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{exp.role || "Role"}</div>
                  <div style={{ color: "#8B5CF6", fontWeight: 600, fontSize: 13 }}>{exp.company}</div>
                </div>
                <div style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap", marginLeft: 12 }}>
                  {exp.start}{(exp.start && exp.end) ? " – " : ""}{exp.end}
                </div>
              </div>
              {exp.desc && (
                <div style={{ marginTop: 6, color: "#444", fontSize: 13, whiteSpace: "pre-line" }}>{exp.desc}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.some(e => e.school || e.degree) && (
        <div style={{ marginBottom: 22 }}>
          <SectionTitle label="Education" />
          {education.filter(e => e.school || e.degree).map(edu => (
            <div key={edu.id} style={{ marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</div>
                <div style={{ color: "#555", fontSize: 13 }}>{edu.school}</div>
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>{edu.year}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <div>
          <SectionTitle label="Skills" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skillList.map((s, i) => (
              <span key={i} style={{
                background: "#F3F0FF", color: "#7C3AED", borderRadius: 6,
                padding: "3px 10px", fontSize: 12, fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ClassicTemplate({ data }) {
  const { personal: p, summary, experience, education, skills } = data;
  const skillList = skills.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <div className="print-area" style={{
      fontFamily: "'Inter', sans-serif", background: "white", color: "#111",
      width: "100%", minHeight: "297mm", fontSize: 13, lineHeight: 1.6, display: "flex",
    }}>
      {/* Left sidebar */}
      <div style={{ width: 200, background: "#1E1B4B", color: "white", padding: "36px 20px", flexShrink: 0 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, margin: "0 auto 16px" }}>
          {(p.name || "?")[0]?.toUpperCase()}
        </div>
        {p.email && <SideItem icon="✉" text={p.email} />}
        {p.phone && <SideItem icon="📱" text={p.phone} />}
        {p.location && <SideItem icon="📍" text={p.location} />}
        {p.linkedin && <SideItem icon="🔗" text={p.linkedin} />}
        {skillList.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#A5B4FC", marginBottom: 10 }}>Skills</div>
            {skillList.map((s, i) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{s}</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,.15)", borderRadius: 2, marginTop: 2 }}>
                  <div style={{ height: "100%", width: "80%", background: "#8B5CF6", borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, padding: "36px 32px" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#1E1B4B" }}>{p.name || "Your Name"}</div>
          <div style={{ fontSize: 14, color: "#8B5CF6", fontWeight: 600, marginTop: 2 }}>{p.title || "Your Title"}</div>
        </div>
        {summary && (
          <div style={{ marginBottom: 20 }}>
            <ClassicSectionTitle label="About Me" />
            <p style={{ color: "#444", lineHeight: 1.7, fontSize: 13 }}>{summary}</p>
          </div>
        )}
        {experience.some(e => e.company || e.role) && (
          <div style={{ marginBottom: 20 }}>
            <ClassicSectionTitle label="Experience" />
            {experience.filter(e => e.company || e.role).map(exp => (
              <div key={exp.id} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, color: "#1E1B4B" }}>{exp.role}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#8B5CF6", fontSize: 12, fontWeight: 600 }}>{exp.company}</span>
                  <span style={{ color: "#888", fontSize: 12 }}>{exp.start}{(exp.start && exp.end) ? " – " : ""}{exp.end}</span>
                </div>
                {exp.desc && <div style={{ marginTop: 4, color: "#555", whiteSpace: "pre-line", fontSize: 12 }}>{exp.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {education.some(e => e.school || e.degree) && (
          <div>
            <ClassicSectionTitle label="Education" />
            {education.filter(e => e.school || e.degree).map(edu => (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, color: "#1E1B4B" }}>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#555", fontSize: 12 }}>{edu.school}</span>
                  <span style={{ color: "#888", fontSize: 12 }}>{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SideItem({ icon, text }) {
  return <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 8, fontSize: 11, color: "rgba(255,255,255,.8)", wordBreak: "break-all" }}><span>{icon}</span><span>{text}</span></div>;
}

function SectionTitle({ label }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#8B5CF6", borderBottom: "1.5px solid #EDE9FE", paddingBottom: 4, marginBottom: 12 }}>{label}</div>
  );
}
function ClassicSectionTitle({ label }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#1E1B4B", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
      <span>{label}</span><div style={{ flex: 1, height: 1.5, background: "#EDE9FE" }} />
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = ["Personal", "Summary", "Experience", "Education", "Skills"];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(DEFAULT);
  const [step, setStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef();

  const update = (key, val) => setData(d => ({ ...d, [key]: val }));

  const handlePrint = () => {
    const orig = document.title;
    document.title = (data.personal.name || "Resume") + " - Resume";
    window.print();
    document.title = orig;
  };

  const Template = data.template === "classic" ? ClassicTemplate : ModernTemplate;

  return (
    <>
      <style>{CSS}</style>

      {/* Top Bar */}
      <div className="no-print" style={{
        position: "sticky", top: 0, zIndex: 100, background: "rgba(15,15,16,.92)",
        backdropFilter: "blur(16px)", borderBottom: `1px solid ${T.line}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#8B5CF6,#6D28D9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>📄</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: T.t1 }}>ResumeForge</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowPreview(!showPreview)} style={{
            background: showPreview ? T.accent : "transparent",
            border: `1px solid ${showPreview ? T.accent : T.inputBorder}`,
            color: showPreview ? "white" : T.t2, borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer",
          }}>
            {showPreview ? "✏️ Edit" : "👁 Preview"}
          </button>
          <button onClick={handlePrint} style={{
            background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", border: "none",
            color: "white", borderRadius: 8, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            ⬇ Download PDF
          </button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>

        {/* Left — Editor */}
        {!showPreview && (
          <div className="no-print" style={{ width: 420, flexShrink: 0, borderRight: `1px solid ${T.line}`, overflowY: "auto", padding: "20px 16px" }}>

            {/* Template Picker */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["modern", "classic"].map(t => (
                <button key={t} onClick={() => update("template", t)} style={{
                  flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500,
                  background: data.template === t ? T.accent : T.bg2,
                  border: `1px solid ${data.template === t ? T.accent : T.line}`,
                  color: data.template === t ? "white" : T.t2,
                }}>
                  {t === "modern" ? "✦ Modern" : "◈ Classic"}
                </button>
              ))}
            </div>

            {/* Steps */}
            <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
              {STEPS.map((s, i) => (
                <button key={s} onClick={() => setStep(i)} style={{
                  flex: 1, padding: "5px 0", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600,
                  background: step === i ? T.accent : T.bg2,
                  border: `1px solid ${step === i ? T.accent : T.line}`,
                  color: step === i ? "white" : T.t3,
                }}>{s}</button>
              ))}
            </div>

            {/* Form */}
            {step === 0 && <PersonalSection data={data.personal} onChange={v => update("personal", v)} />}
            {step === 1 && <SummarySection data={data.summary} onChange={v => update("summary", v)} />}
            {step === 2 && <ExperienceSection data={data.experience} onChange={v => update("experience", v)} />}
            {step === 3 && <EducationSection data={data.education} onChange={v => update("education", v)} />}
            {step === 4 && <SkillsSection data={data.skills} onChange={v => update("skills", v)} />}

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: T.bg2, border: `1px solid ${T.line}`, color: T.t2, borderRadius: 8, padding: "9px", fontSize: 13, cursor: "pointer" }}>← Back</button>}
              {step < STEPS.length - 1
                ? <button onClick={() => setStep(s => s + 1)} style={{ flex: 1, background: T.accent, border: "none", color: "white", borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Next →</button>
                : <button onClick={() => setShowPreview(true)} style={{ flex: 1, background: T.green, border: "none", color: "white", borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Preview Resume ✓</button>
              }
            </div>
          </div>
        )}

        {/* Right — Preview */}
        <div style={{ flex: 1, overflowY: "auto", background: showPreview ? T.bg0 : "#1a1a1b", display: "flex", justifyContent: "center", padding: showPreview ? "28px 0" : "28px 24px 28px 0" }}>
          <div ref={printRef} style={{ width: "100%", maxWidth: 720, background: "white", boxShadow: "0 8px 40px rgba(0,0,0,.5)", borderRadius: showPreview ? 0 : 12, overflow: "hidden" }}>
            <Template data={data} />
          </div>
        </div>

      </div>
    </>
  );
}
