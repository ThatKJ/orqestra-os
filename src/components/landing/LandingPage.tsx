"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const C = {
  bg: "#0A0A0F",
  surface: "#111118",
  surfaceHigh: "#16161F",
  border: "#1E1E2E",
  borderHigh: "#2A2A3E",
  primary: "#6366F1",
  primaryGlow: "rgba(99,102,241,0.15)",
  primaryHover: "#818CF8",
  success: "#10B981",
  successGlow: "rgba(16,185,129,0.15)",
  warn: "#F59E0B",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#475569",
  indigo100: "rgba(99,102,241,0.1)",
  emerald100: "rgba(16,185,129,0.1)",
};

async function submitToWaitlist(email: string): Promise<string> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source: "landing-page" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data.message;
}

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: ${C.bg};
      color: ${C.textPrimary};
      font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    ::selection { background: ${C.primary}; color: white; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${C.bg}; }
    ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

    @keyframes pulse-node {
      0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
    }

    @keyframes pulse-success {
      0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
    }

    @keyframes flow-dash {
      to { stroke-dashoffset: -24; }
    }

    @keyframes slide-up {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    @keyframes dot-blink {
      0%, 80%, 100% { opacity: 0.2; }
      40% { opacity: 1; }
    }

    @keyframes execution-fill {
      from { width: 0%; }
      to { width: 100%; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }

    @keyframes grid-fade {
      from { opacity: 0; }
      to { opacity: 0.4; }
    }

    .animate-slide-up { animation: slide-up 0.6s ease forwards; }
    .animate-fade-in { animation: fade-in 0.8s ease forwards; }
    .animate-float { animation: float 6s ease-in-out infinite; }

    .fade-in-section {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .fade-in-section.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .node-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .node-card:hover {
      transform: translateY(-2px);
      border-color: ${C.primary} !important;
      box-shadow: 0 0 20px rgba(99,102,241,0.15);
    }

    .cta-button {
      position: relative;
      overflow: hidden;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .cta-button::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .cta-button:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(99,102,241,0.4); }
    .cta-button:hover::before { opacity: 1; }
    .cta-button:active { transform: translateY(0); }

    .ghost-button {
      transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    }
    .ghost-button:hover {
      background: rgba(255,255,255,0.05);
      border-color: ${C.borderHigh};
    }

    .integration-chip {
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }
    .integration-chip:hover {
      transform: translateY(-2px);
      border-color: ${C.primary};
      background: ${C.indigo100};
    }

    .comparison-row:hover td {
      background: rgba(255,255,255,0.02);
    }

    .log-line {
      animation: slide-up 0.3s ease forwards;
    }

    .input-field {
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .input-field:focus {
      outline: none;
      border-color: ${C.primary};
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
    }

    .faq-item {
      transition: background 0.2s ease;
    }
    .faq-item:hover {
      background: ${C.surfaceHigh};
    }
  `}</style>
);

function useInView(ref: React.RefObject<HTMLDivElement | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function FadeSection({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={`fade-in-section${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

// ─── ANIMATED WORKFLOW CANVAS ─────────────────────────────────────────────────
const WORKFLOW_NODES = [
  { id: "trigger", x: 60, y: 160, label: "Webhook", sublabel: "POST /trigger", color: C.warn, icon: "⚡" },
  { id: "gpt", x: 240, y: 80, label: "GPT-4o", sublabel: "Analyze intent", color: C.primary, icon: "◎" },
  { id: "claude", x: 240, y: 240, label: "Claude", sublabel: "Draft response", color: C.primary, icon: "◎" },
  { id: "condition", x: 430, y: 160, label: "Condition", sublabel: "confidence > 0.8", color: "#A78BFA", icon: "◇" },
  { id: "db", x: 610, y: 80, label: "Database", sublabel: "INSERT result", color: C.success, icon: "⊞" },
  { id: "slack", x: 610, y: 240, label: "Slack API", sublabel: "Notify team", color: C.success, icon: "⊡" },
  { id: "output", x: 790, y: 160, label: "Output", sublabel: "Response sent", color: C.success, icon: "✓" },
];

const WORKFLOW_EDGES = [
  { from: "trigger", to: "gpt" },
  { from: "trigger", to: "claude" },
  { from: "gpt", to: "condition" },
  { from: "claude", to: "condition" },
  { from: "condition", to: "db" },
  { from: "condition", to: "slack" },
  { from: "db", to: "output" },
  { from: "slack", to: "output" },
];

function getNodeCenter(id: string, nodes: typeof WORKFLOW_NODES) {
  const n = nodes.find(n => n.id === id);
  if (!n) return { x: 0, y: 0 };
  return { x: n.x + 70, y: n.y + 28 };
}

function WorkflowCanvas({ running, activeNodes, compact = false }: { running?: boolean; activeNodes?: string[]; compact?: boolean }) {
  const scale = compact ? 0.62 : 1;
  const W = 900, H = 360;

  return (
    <div style={{
      position: "relative",
      width: compact ? W * scale : "100%",
      height: H * scale,
      overflow: "hidden",
    }}>
      <svg
        width={W * scale}
        height={H * scale}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={C.border} strokeWidth="0.5" />
          </pattern>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill={C.textMuted} />
          </marker>
          <marker id="arrowhead-active" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill={C.primary} />
          </marker>
        </defs>
        <rect width={W} height={H} fill="transparent" />
        <rect width={W} height={H} fill="url(#grid)" opacity="0.3" />

        {WORKFLOW_EDGES.map((edge, i) => {
          const from = getNodeCenter(edge.from, WORKFLOW_NODES);
          const to = getNodeCenter(edge.to, WORKFLOW_NODES);
          const activeSet = activeNodes ?? [];
          const isActive = running && activeSet.includes(edge.from) && activeSet.includes(edge.to);
          const mx = (from.x + to.x) / 2;
          return (
            <g key={i}>
              <path
                d={`M ${from.x} ${from.y} C ${mx} ${from.y}, ${mx} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke={isActive ? C.primary : C.border}
                strokeWidth={isActive ? 1.5 : 1}
                markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                opacity={isActive ? 1 : 0.5}
                style={isActive ? {
                  strokeDasharray: "8 4",
                  animation: "flow-dash 0.4s linear infinite",
                } as React.CSSProperties : {}}
              />
            </g>
          );
        })}
      </svg>

      {WORKFLOW_NODES.map((node) => {
        const activeSet = activeNodes ?? [];
        const isActive = running && activeSet.includes(node.id);
        const isDone = running && !activeSet.includes(node.id) &&
          activeSet.some(() => WORKFLOW_EDGES.some(e => e.from === node.id));

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: node.x * scale,
              top: node.y * scale,
              width: 140 * scale,
              background: C.surface,
              border: `1px solid ${isActive ? node.color : isDone ? C.success : C.border}`,
              borderRadius: 8 * scale,
              padding: `${8 * scale}px ${10 * scale}px`,
              boxShadow: isActive ? `0 0 16px ${node.color}44` : isDone ? `0 0 8px ${C.success}33` : "none",
              transition: "all 0.3s ease",
              animation: isActive ? `pulse-node 1.5s ease infinite` : "none",
              cursor: "default",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 * scale, marginBottom: 2 * scale }}>
              <span style={{
                fontSize: 11 * scale,
                color: isActive ? node.color : isDone ? C.success : C.textMuted
              }}>{node.icon}</span>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 11 * scale,
                fontWeight: 700,
                color: isActive ? node.color : isDone ? C.success : C.textPrimary,
                letterSpacing: "0.01em",
              }}>{node.label}</span>
              {isDone && (
                <span style={{ marginLeft: "auto", color: C.success, fontSize: 10 * scale }}>✓</span>
              )}
              {isActive && (
                <span style={{ marginLeft: "auto" }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      display: "inline-block", width: 4 * scale, height: 4 * scale,
                      background: node.color, borderRadius: "50%", marginLeft: 2 * scale,
                      animation: `dot-blink 1.4s ${i * 0.2}s ease infinite`,
                    }} />
                  ))}
                </span>
              )}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9 * scale,
              color: C.textMuted,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>{node.sublabel}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── EXECUTION DEMO ───────────────────────────────────────────────────────────
const EXECUTION_SEQUENCE = [
  { nodes: ["trigger"], log: "> Webhook received — POST /trigger", delay: 0 },
  { nodes: ["trigger", "gpt"], log: "> GPT-4o: analyzing intent...", delay: 900 },
  { nodes: ["trigger", "claude"], log: "> Claude: drafting response...", delay: 1200 },
  { nodes: ["trigger", "gpt", "claude", "condition"], log: "> Condition: confidence=0.94 → true", delay: 2400 },
  { nodes: ["trigger", "gpt", "claude", "condition", "db"], log: "> Database: INSERT successful (id=8821)", delay: 3200 },
  { nodes: ["trigger", "gpt", "claude", "condition", "db", "slack"], log: "> Slack: #alerts notified ✓", delay: 3800 },
  { nodes: ["trigger", "gpt", "claude", "condition", "db", "slack", "output"], log: "> Execution complete — 4.2s ✓", delay: 4500 },
];

function ExecutionDemo() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const runDemo = useCallback(() => {
    if (running) return;
    setRunning(true);
    setStep(-1);
    setLogs([]);
    setProgress(0);
    setCompleted(false);
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    EXECUTION_SEQUENCE.forEach((seq, i) => {
      const t = setTimeout(() => {
        setStep(i);
        setLogs(prev => [...prev, seq.log]);
        setProgress(Math.round(((i + 1) / EXECUTION_SEQUENCE.length) * 100));
        if (i === EXECUTION_SEQUENCE.length - 1) {
          setTimeout(() => { setRunning(false); setCompleted(true); }, 600);
        }
      }, seq.delay);
      timeouts.current.push(t);
    });
  }, [running]);

  const activeNodes = step >= 0 ? EXECUTION_SEQUENCE[step].nodes : [];

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: `1px solid ${C.border}`,
        background: C.surfaceHigh,
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: C.textMuted,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: running ? C.warn : completed ? C.success : C.textMuted,
            display: "inline-block",
            animation: running ? "pulse-node 1s infinite" : "none",
          }} />
          {running ? "Running..." : completed ? "Completed · 4.2s" : "Ready"}
        </div>
        <button
          onClick={runDemo}
          disabled={running}
          className="cta-button"
          style={{
            background: running ? C.border : C.primary,
            color: running ? C.textMuted : "white",
            border: "none",
            borderRadius: 6,
            padding: "6px 16px",
            fontSize: 12,
            fontWeight: 600,
            cursor: running ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {running ? "Running" : "▶ Run Workflow"}
        </button>
      </div>

      <div style={{ padding: "24px 24px 16px", overflowX: "auto" }}>
        <WorkflowCanvas running={running || completed} activeNodes={activeNodes} compact={true} />
      </div>

      {(running || completed) && (
        <div style={{ margin: "0 24px", height: 2, background: C.border, borderRadius: 1 }}>
          <div style={{
            height: "100%",
            background: `linear-gradient(90deg, ${C.primary}, ${C.success})`,
            borderRadius: 1,
            width: `${progress}%`,
            transition: "width 0.4s ease",
          }} />
        </div>
      )}

      <div style={{
        margin: "12px 24px 20px",
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "12px 14px",
        minHeight: 100,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: C.textMuted,
      }}>
        {logs.length === 0 ? (
          <span style={{ color: C.textMuted }}>_ Hit &ldquo;Run Workflow&rdquo; to see live execution</span>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="log-line" style={{
              marginBottom: 4,
              color: log.includes("complete") ? C.success : log.includes("✓") ? C.success : C.textSecondary,
            }}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ onWaitlist }: { onWaitlist: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: "0 24px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Image
          src="/dark_logo.png"
          alt="Orqestra"
          width={26}
          height={26}
          style={{ borderRadius: 6 }}
        />
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          color: C.textPrimary,
          letterSpacing: "-0.01em",
        }}>Orqestra</span>
        <span style={{
          fontSize: 9,
          fontWeight: 600,
          color: C.primary,
          background: C.indigo100,
          border: `1px solid rgba(99,102,241,0.3)`,
          borderRadius: 4,
          padding: "2px 6px",
          letterSpacing: "0.08em",
          fontFamily: "'Inter', sans-serif",
        }}>BETA</span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          className="ghost-button"
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.textSecondary,
            borderRadius: 8,
            padding: "7px 14px",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
          onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
        >
          How it works
        </button>
        <button
          className="cta-button"
          style={{
            background: C.primary,
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "7px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
          onClick={onWaitlist}
        >
          Join waitlist
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onWaitlist }: { onWaitlist: () => void }) {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 24px 60px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(${C.border} 1px, transparent 1px),
          linear-gradient(90deg, ${C.border} 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        opacity: 0.15,
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
      }} />

      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 600,
        height: 300,
        background: `radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        left: "30%",
        width: 300,
        height: 200,
        background: `radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        maxWidth: 760,
        textAlign: "center",
        animation: "slide-up 0.8s ease forwards",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: C.indigo100,
          border: `1px solid rgba(99,102,241,0.3)`,
          borderRadius: 100,
          padding: "6px 14px",
          marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, display: "inline-block" }} />
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: C.primary,
            letterSpacing: "0.1em",
            fontFamily: "'Inter', sans-serif",
          }}>THE AI WORKFLOW OS</span>
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(36px, 5.5vw, 64px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: C.textPrimary,
          marginBottom: 24,
        }}>
          Your AI tools don&apos;t{" "}
          <span style={{
            background: `linear-gradient(135deg, ${C.primary} 0%, #A78BFA 50%, #818CF8 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            talk to each other.
          </span>
          <br />
          Now they will.
        </h1>

        <p style={{
          fontSize: "clamp(15px, 1.8vw, 18px)",
          color: C.textSecondary,
          lineHeight: 1.7,
          maxWidth: 560,
          margin: "0 auto 40px",
          fontWeight: 400,
        }}>
          Connect OpenAI, Claude, Gemini, your APIs, and your databases into
          visual workflows that actually execute — without writing orchestration code.
        </p>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: C.emerald100,
          border: `1px solid rgba(16,185,129,0.4)`,
          borderRadius: 12,
          padding: "14px 24px",
          color: C.success,
          fontWeight: 600,
          fontSize: 15,
          animation: "fade-in 0.4s ease",
        }}>
          <button
            onClick={onWaitlist}
            style={{
              background: "none",
              border: "none",
              color: C.success,
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⚡</span>
            Join 1,400+ founders on the waitlist →
          </button>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginTop: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex" }}>
              {["#6366F1", "#818CF8", "#10B981", "#A78BFA", "#F59E0B"].map((c, i) => (
                <div key={i} style={{
                  width: 22, height: 22,
                  borderRadius: "50%",
                  background: c,
                  border: `2px solid ${C.bg}`,
                  marginLeft: i > 0 ? -8 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  color: "white",
                  fontWeight: 700,
                }} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: C.textMuted }}>
              <strong style={{ color: C.textSecondary }}>1,400+ founders</strong> on the waitlist
            </span>
          </div>
          <div style={{ width: 1, height: 14, background: C.border }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: "#FBBF24", fontSize: 12 }}>★</span>
            ))}
            <span style={{ fontSize: 13, color: C.textMuted }}>4.9 from beta testers</span>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 64,
        width: "100%",
        maxWidth: 900,
        position: "relative",
        animation: "slide-up 1s 0.3s ease both",
      }}>
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: `0 0 80px rgba(99,102,241,0.08), 0 40px 120px rgba(0,0,0,0.5)`,
        }}>
          <div style={{
            background: C.surfaceHigh,
            borderBottom: `1px solid ${C.border}`,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
            <span style={{
              marginLeft: 12,
              fontSize: 11,
              color: C.textMuted,
              fontFamily: "'JetBrains Mono', monospace",
            }}>orqestra · customer-intelligence-workflow</span>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <WorkflowCanvas running={true} activeNodes={["trigger", "gpt", "claude"]} compact={false} />
          </div>
        </div>
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 80,
          background: `linear-gradient(transparent, ${C.bg})`,
          pointerEvents: "none",
        }} />
      </div>
    </section>
  );
}

// ─── PROBLEM SECTION ──────────────────────────────────────────────────────────
const TOOL_CHAOS = [
  { name: "ChatGPT", color: "#10A37F" },
  { name: "Claude", color: "#CC785C" },
  { name: "Cursor", color: "#6366F1" },
  { name: "n8n", color: "#EF4444" },
  { name: "Midjourney", color: "#A78BFA" },
  { name: "Notion", color: "#F8FAFC" },
  { name: "Vercel", color: "#F8FAFC" },
  { name: "Postman", color: "#F59E0B" },
];

function ProblemSection() {
  return (
    <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeSection>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 600,
            color: C.warn,
            letterSpacing: "0.1em",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 100,
            padding: "5px 12px",
            marginBottom: 20,
          }}>THE PROBLEM</div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Right now, your AI workflow<br />
            <span style={{ color: C.warn }}>looks like this:</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16 }}>
            Manual. Fragmented. Losing hours every week.
          </p>
        </div>
      </FadeSection>

      <FadeSection delay={100}>
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "48px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            alignItems: "center",
            maxWidth: 700,
            margin: "0 auto 40px",
          }}>
            {TOOL_CHAOS.map((tool, i) => (
              <div key={i}>
                <div style={{
                  background: C.surfaceHigh,
                  border: `1px solid ${C.borderHigh}`,
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: tool.color,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                  {tool.name}
                </div>
                {i < TOOL_CHAOS.length - 1 && (
                  <span style={{
                    color: C.textMuted,
                    fontSize: 14,
                    marginLeft: 8,
                  }}>
                    {["→", "⇢", "↗", "⬇", "↙", "→", "↪", "↘"][i % 8]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{
            background: C.surfaceHigh,
            borderRadius: 10,
            padding: "14px 24px",
            display: "inline-block",
            fontSize: 13,
            color: C.textMuted,
            fontFamily: "'JetBrains Mono', monospace",
            border: `1px solid ${C.border}`,
          }}>
            Copy output → paste into next tool → copy again → manually trigger → hope it works → repeat tomorrow
          </div>

          <div style={{
            marginTop: 40,
            display: "flex",
            gap: 32,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {[
              { num: "4.5h", label: "lost per week to manual context switching" },
              { num: "7+", label: "tabs open during a typical AI session" },
              { num: "0", label: "of these tools share execution context" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 36,
                  fontWeight: 800,
                  color: C.warn,
                  letterSpacing: "-0.04em",
                }}>{stat.num}</div>
                <div style={{ fontSize: 12, color: C.textMuted, maxWidth: 140 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>
    </section>
  );
}

// ─── SOLUTION SECTION ─────────────────────────────────────────────────────────
function SolutionSection() {
  return (
    <section style={{ padding: "60px 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeSection>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 600,
            color: C.success,
            letterSpacing: "0.1em",
            background: C.emerald100,
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 100,
            padding: "5px 12px",
            marginBottom: 20,
          }}>THE SOLUTION</div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Here&apos;s what it looks like<br />
            <span style={{ color: C.success }}>inside Orqestra:</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16 }}>
            Every tool connected. Every step observable. Every run reproducible.
          </p>
        </div>
      </FadeSection>

      <FadeSection delay={150}>
        <ExecutionDemo />
      </FadeSection>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: "⊕",
      title: "Connect",
      desc: "Drag in your AI models, APIs, databases, and MCP servers from the sidebar. No config files. No YAML. Just click and connect.",
      detail: "Supports OpenAI, Anthropic, Gemini, REST APIs, PostgreSQL, SQLite, Webhooks, MCP Servers, and more.",
    },
    {
      num: "02",
      icon: "⤢",
      title: "Build",
      desc: "Wire nodes together on a visual canvas. Set prompts, conditions, output formats. The workflow is the documentation.",
      detail: "React Flow canvas with sequential execution. Condition nodes, retry logic, and branching built-in.",
    },
    {
      num: "03",
      icon: "▶",
      title: "Run",
      desc: "Hit execute. Watch it stream in real time. Inspect every step, every output, every failure. Debug without diving into logs.",
      detail: "SSE streaming. Per-node execution state. Full execution history. One-click replay.",
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeSection>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>
            From idea to running workflow<br />in under 15 minutes.
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16 }}>
            No PhD in distributed systems required.
          </p>
        </div>
      </FadeSection>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
      }}>
        {steps.map((step, i) => (
          <FadeSection key={i} delay={i * 120}>
            <div
              className="node-card"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "32px 28px",
                height: "100%",
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 24,
              }}>
                <div style={{
                  width: 48, height: 48,
                  background: C.indigo100,
                  border: `1px solid rgba(99,102,241,0.3)`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: C.primary,
                }}>{step.icon}</div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: C.textMuted,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}>{step.num}</span>
              </div>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 12,
                letterSpacing: "-0.02em",
              }}>{step.title}</h3>
              <p style={{
                color: C.textSecondary,
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 16,
              }}>{step.desc}</p>
              <p style={{
                color: C.textMuted,
                fontSize: 12,
                lineHeight: 1.6,
                fontFamily: "'JetBrains Mono', monospace",
                padding: "10px 12px",
                background: C.bg,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
              }}>{step.detail}</p>
            </div>
          </FadeSection>
        ))}
      </div>
    </section>
  );
}

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { name: "OpenAI", color: "#10A37F", icon: "◉" },
  { name: "Anthropic", color: "#CC785C", icon: "◎" },
  { name: "Gemini", color: "#4285F4", icon: "◈" },
  { name: "PostgreSQL", color: "#336791", icon: "⊞" },
  { name: "SQLite", color: "#0F80CC", icon: "⊡" },
  { name: "REST API", color: "#F59E0B", icon: "⟳" },
  { name: "Webhooks", color: "#A78BFA", icon: "⚡" },
  { name: "MCP Servers", color: "#6366F1", icon: "⊛" },
  { name: "Slack", color: "#4A154B", icon: "≡" },
  { name: "GitHub", color: "#F8FAFC", icon: "⊙" },
  { name: "Notion", color: "#F8FAFC", icon: "☰" },
  { name: "More soon", color: C.textMuted, icon: "+" },
];

function IntegrationsSection() {
  return (
    <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeSection>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>If it has an API, it connects.</h2>
          <p style={{ color: C.textMuted, fontSize: 16 }}>
            First-class nodes for every tool you already use.
          </p>
        </div>
      </FadeSection>

      <FadeSection delay={100}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
        }}>
          {INTEGRATIONS.map((item, i) => (
            <div
              key={i}
              className="integration-chip"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px 18px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "default",
              }}
            >
              <span style={{ color: item.color, fontSize: 14 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: item.color === C.textMuted ? C.textMuted : C.textPrimary }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </FadeSection>
    </section>
  );
}

// ─── USE CASES ────────────────────────────────────────────────────────────────
function UseCasesSection() {
  const cases = [
    {
      title: "Research pipeline",
      flow: ["Trigger", "Claude", "Summarize", "Notion"],
      desc: "Auto-research a topic, summarize across sources, and push structured notes to Notion. Runs in 45 seconds.",
      tag: "Research",
      tagColor: C.primary,
    },
    {
      title: "Content factory",
      flow: ["Idea", "GPT-4o", "Claude editor", "Publish API"],
      desc: "Turn a raw idea into a polished blog post with multi-model editing. One run, four steps, zero context switching.",
      tag: "Content",
      tagColor: "#A78BFA",
    },
    {
      title: "Customer intelligence",
      flow: ["Webhook", "Claude analyze", "Slack alert", "DB log"],
      desc: "Ingest customer feedback, classify intent with Claude, alert Slack on high-priority items, and log everything.",
      tag: "Automation",
      tagColor: C.success,
    },
  ];

  return (
    <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeSection>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>What founders are building</h2>
          <p style={{ color: C.textMuted, fontSize: 16 }}>
            Real workflows shipping from the beta.
          </p>
        </div>
      </FadeSection>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24,
      }}>
        {cases.map((uc, i) => (
          <FadeSection key={i} delay={i * 100}>
            <div
              className="node-card"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "28px 24px",
              }}
            >
              <div style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 700,
                color: uc.tagColor,
                background: `${uc.tagColor}18`,
                border: `1px solid ${uc.tagColor}33`,
                borderRadius: 6,
                padding: "3px 10px",
                letterSpacing: "0.08em",
                marginBottom: 18,
              }}>{uc.tag}</div>

              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}>{uc.title}</h3>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 16,
                flexWrap: "wrap",
              }}>
                {uc.flow.map((step, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                      background: C.surfaceHigh,
                      border: `1px solid ${C.border}`,
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: uc.tagColor,
                    }}>{step}</div>
                    {j < uc.flow.length - 1 && (
                      <span style={{ color: C.textMuted, fontSize: 11 }}>→</span>
                    )}
                  </div>
                ))}
              </div>

              <p style={{ color: C.textSecondary, fontSize: 13, lineHeight: 1.7 }}>
                {uc.desc}
              </p>
            </div>
          </FadeSection>
        ))}
      </div>
    </section>
  );
}

// ─── COMPARISON TABLE ─────────────────────────────────────────────────────────
function ComparisonSection() {
  const rows = [
    { feature: "Visual workflow builder", orq: true, n8n: true, zapier: true, lang: false, crew: false },
    { feature: "Multi-model AI (OpenAI + Claude + Gemini)", orq: true, n8n: false, zapier: false, lang: true, crew: true },
    { feature: "AI-native node design", orq: true, n8n: false, zapier: false, lang: true, crew: true },
    { feature: "Real-time execution streaming", orq: true, n8n: false, zapier: false, lang: false, crew: false },
    { feature: "Per-step execution logs", orq: true, n8n: true, zapier: false, lang: false, crew: false },
    { feature: "MCP server support", orq: true, n8n: false, zapier: false, lang: false, crew: false },
    { feature: "Founder-friendly (< 15 min to ship)", orq: true, n8n: false, zapier: true, lang: false, crew: false },
    { feature: "No Python/code required", orq: true, n8n: true, zapier: true, lang: false, crew: false },
  ];

  const cols = [
    { key: "orq" as const, label: "Orqestra", highlight: true },
    { key: "n8n" as const, label: "n8n" },
    { key: "zapier" as const, label: "Zapier" },
    { key: "lang" as const, label: "LangGraph" },
    { key: "crew" as const, label: "CrewAI" },
  ];

  return (
    <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeSection>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>Built for founders, not enterprises.</h2>
          <p style={{ color: C.textMuted, fontSize: 16 }}>
            Every existing tool makes you choose between power and simplicity. Orqestra doesn&apos;t.
          </p>
        </div>
      </FadeSection>

      <FadeSection delay={100}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "14px 20px", color: C.textMuted, fontSize: 12, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>
                  Feature
                </th>
                {cols.map(col => (
                  <th key={col.key} style={{
                    textAlign: "center",
                    padding: "14px 16px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: col.highlight ? C.primary : C.textMuted,
                    borderBottom: `1px solid ${col.highlight ? C.primary : C.border}`,
                    background: col.highlight ? C.indigo100 : "transparent",
                    borderRadius: col.highlight ? "8px 8px 0 0" : 0,
                  }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="comparison-row" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: C.textSecondary }}>{row.feature}</td>
                  {cols.map(col => (
                    <td key={col.key} style={{
                      textAlign: "center",
                      padding: "13px 16px",
                      background: col.highlight ? C.indigo100 : "transparent",
                      fontSize: 15,
                    }}>
                      {row[col.key]
                        ? <span style={{ color: col.highlight ? C.success : C.success }}>✓</span>
                        : <span style={{ color: C.textMuted }}>—</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeSection>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "What AI models does Orqestra support?", a: "OpenAI (GPT-4o, o1), Anthropic (Claude 3.5+), and Google Gemini at launch. MCP server support means you can connect any model with an MCP endpoint." },
    { q: "Do I need to write code?", a: "No. The workflow builder is fully visual. You set prompts, conditions, and configurations through node panels — no YAML, no Python." },
    { q: "How is this different from n8n?", a: "n8n was built for integration automation. Orqestra is built for AI execution — multi-model orchestration, execution streaming, per-node observability, and AI-native node design are first-class features, not plugins." },
    { q: "Can I self-host?", a: "Yes. The entire stack is Node.js + Next.js + SQLite. A single server is enough. PostgreSQL migration is documented for production workloads." },
    { q: "What's the execution model?", a: "Sequential execution for the MVP. Each node runs, passes its output as context to the next, and the full execution is persisted. Parallel execution paths are on the roadmap." },
    { q: "Does it support MCP?", a: "Yes. MCP Server and MCP Tool nodes are in Phase 8 of the roadmap. Beta testers can connect MCP-compatible tools without writing custom integration code." },
    { q: "When does it launch publicly?", a: "Public beta is targeting Q3. Waitlist members get early access, direct feedback channels, and locked pricing for the first 6 months." },
    { q: "What's the pricing model?", a: "Finalizing pricing now. Waitlist members will have input. The direction is usage-based with a generous free tier for solo founders." },
  ];

  return (
    <section style={{ padding: "100px 24px", maxWidth: 720, margin: "0 auto" }}>
      <FadeSection>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          textAlign: "center",
          marginBottom: 56,
        }}>Questions</h2>
      </FadeSection>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {faqs.map((faq, i) => (
          <FadeSection key={i} delay={i * 40}>
            <div
              className="faq-item"
              style={{
                background: C.surface,
                border: `1px solid ${open === i ? C.borderHigh : C.border}`,
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div style={{
                padding: "18px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>
                  {faq.q}
                </span>
                <span style={{
                  color: C.textMuted,
                  fontSize: 18,
                  transform: open === i ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s ease",
                  flexShrink: 0,
                  marginLeft: 16,
                }}>+</span>
              </div>
              {open === i && (
                <div style={{
                  padding: "0 24px 18px",
                  color: C.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.7,
                  animation: "fade-in 0.2s ease",
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>
    </section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleJoin = async () => {
    if (!email.includes("@") || submitting) return;
    setSubmitting(true);
    setStatus(null);
    try {
      const msg = await submitToWaitlist(email);
      setStatus({ ok: true, msg });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ padding: "100px 24px 140px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 700, height: 400,
        background: `radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <FadeSection>
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: 20,
          }}>
            You didn&apos;t build a company
            to be an integration layer between AI tabs.
          </h2>
          <p style={{
            color: C.textMuted,
            fontSize: 16,
            lineHeight: 1.7,
            maxWidth: 440,
            margin: "0 auto 44px",
          }}>
            Join 1,400+ founders building the next generation of AI-powered products on Orqestra.
          </p>

          {status?.ok ? (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: C.emerald100,
              border: `1px solid rgba(16,185,129,0.4)`,
              borderRadius: 14,
              padding: "18px 28px",
              color: C.success,
              fontWeight: 600,
              fontSize: 16,
              animation: "fade-in 0.4s ease",
            }}>
              <span style={{ fontSize: 20 }}>✓</span>
              You&apos;re on the list. Early access coming Q3.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleJoin()}
                  className="input-field"
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "14px 20px",
                    fontSize: 15,
                    color: C.textPrimary,
                    width: 280,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <button
                  onClick={handleJoin}
                  disabled={submitting}
                  className="cta-button"
                  style={{
                    background: `linear-gradient(135deg, ${C.primary}, #818CF8)`,
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 28px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Inter', sans-serif",
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? "Joining..." : "Get early access →"}
                </button>
              </div>
              {status && !status.ok && (
                <p style={{ marginTop: 12, fontSize: 13, color: "#EF4444" }}>{status.msg}</p>
              )}
            </>
          )}

          <p style={{ marginTop: 16, fontSize: 12, color: C.textMuted }}>
            Free during beta. No credit card.
          </p>
        </div>
      </FadeSection>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${C.border}`,
      padding: "32px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16,
      maxWidth: 1100,
      margin: "0 auto",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Image
          src="/dark_logo.png"
          alt="Orqestra"
          width={20}
          height={20}
          style={{ borderRadius: 4 }}
        />
        <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>
          Orqestra OS — The Control Plane for AI Systems
        </span>
      </div>
      <div style={{ display: "flex", gap: 24, fontSize: 13, color: C.textMuted }}>
        <a href="#" style={{ color: C.textMuted, textDecoration: "none", transition: "color 0.2s ease" }}>X / Twitter</a>
        <a href="#" style={{ color: C.textMuted, textDecoration: "none", transition: "color 0.2s ease" }}>GitHub</a>
        <a href="/privacy" style={{ color: C.textMuted, textDecoration: "none", transition: "color 0.2s ease" }}>Privacy</a>
        <a href="/terms" style={{ color: C.textMuted, textDecoration: "none", transition: "color 0.2s ease" }}>Terms</a>
      </div>
    </footer>
  );
}

// ─── WAITLIST MODAL ───────────────────────────────────────────────────────────
function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleJoin = async () => {
    if (!email.includes("@") || submitting) return;
    setSubmitting(true);
    setStatus(null);
    try {
      const msg = await submitToWaitlist(email);
      setStatus({ ok: true, msg });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fade-in 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.borderHigh}`,
          borderRadius: 20,
          padding: "48px 40px",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          animation: "slide-up 0.3s ease",
          boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.1)`,
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{
          position: "absolute",
          top: 16, right: 16,
          background: "transparent", border: "none",
          color: C.textMuted, fontSize: 20, cursor: "pointer",
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "50%",
        }}>×</button>

        {status?.ok ? (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 24, fontWeight: 800,
              color: C.success,
              marginBottom: 12,
            }}>You&apos;re on the list.</h3>
            <p style={{ color: C.textMuted, fontSize: 14 }}>
              We&apos;ll send you early access ahead of the public launch.
              Expect an email in Q3.
            </p>
            <button onClick={onClose} style={{
              marginTop: 24,
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.textSecondary,
              borderRadius: 10,
              padding: "10px 24px",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{
              width: 56, height: 56,
              background: C.indigo100,
              border: `1px solid rgba(99,102,241,0.3)`,
              borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, margin: "0 auto 24px",
            }}>⚡</div>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 24, fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 10,
            }}>Get early access</h3>
            <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Join 1,400+ founders building AI workflows on Orqestra.
              Free during beta.
            </p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleJoin()}
              autoFocus
              className="input-field"
              style={{
                width: "100%",
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "13px 16px",
                fontSize: 15,
                color: C.textPrimary,
                marginBottom: 12,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            {status && !status.ok && (
              <p style={{ marginBottom: 12, fontSize: 13, color: "#EF4444", textAlign: "left" }}>{status.msg}</p>
            )}
            <button
              onClick={handleJoin}
              disabled={submitting}
              style={{
                width: "100%",
                background: submitting ? C.border : `linear-gradient(135deg, ${C.primary}, #818CF8)`,
                color: submitting ? C.textMuted : "white",
                border: "none",
                borderRadius: 10,
                padding: "13px",
                fontSize: 15,
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {submitting ? "Joining..." : "Join the waitlist →"}
            </button>
            <p style={{ marginTop: 12, fontSize: 11, color: C.textMuted }}>
              No spam. No credit card. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  const handleWaitlist = useCallback(() => setShowModal(true), []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <GlobalStyle />
      <Nav onWaitlist={handleWaitlist} />
      <main>
        <Hero onWaitlist={handleWaitlist} />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <IntegrationsSection />
        <UseCasesSection />
        <ComparisonSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
