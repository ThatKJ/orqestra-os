"use client";

export function Hero() {
  return (
    <section className="relative pt-[140px] pb-20 overflow-hidden text-center dot-grid" id="product">
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08)_0%,transparent_70%)] pointer-events-none" id="hero-glow" />
      <div className="max-w-[1120px] mx-auto px-8">
        <div className="mb-7 fade-up visible">
          <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full border border-[rgba(255,255,255,0.10)] bg-surface-2 font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-text-mid">
            <span className="w-[6px] h-[6px] rounded-full bg-green shadow-[0_0_6px_#34d399]" />
            Open Early Access — June 2026
          </span>
        </div>
        <h1 className="font-display text-[clamp(40px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.03em] text-text-hi max-w-[820px] mx-auto mb-6 fade-up visible" style={{transitionDelay:'0.1s'}}>
          The execution layer<br />for <em className="not-italic text-cyan">AI workflows</em>
        </h1>
        <p className="text-[18px] font-light text-text-mid max-w-[520px] mx-auto mb-10 leading-[1.7] fade-up visible" style={{transitionDelay:'0.2s'}}>
          Connect AI models, APIs, and logic into production-grade workflows.
          Visual builder. Full execution trace. No boilerplate.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap mb-4 fade-up visible" style={{transitionDelay:'0.3s'}}>
          <button
            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-body text-[15px] font-medium text-[#001f25] bg-cyan border-none cursor-pointer px-7 py-3 rounded-[8px] hover:opacity-90 hover:shadow-[0_0_28px_rgba(34,211,238,0.30)] active:scale-[0.98] transition-all tracking-[-0.01em] flex items-center gap-2"
          >
            Join the waitlist
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            onClick={() => document.getElementById('trace-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-body text-[15px] font-medium text-text-mid bg-surface-2 border border-[rgba(255,255,255,0.10)] cursor-pointer px-6 py-3 rounded-[8px] hover:bg-surface-3 hover:text-text-hi transition-all tracking-[-0.01em]"
          >
            See how it works
          </button>
        </div>
        <div className="flex items-center justify-center gap-[10px] mt-4 fade-up visible">
          <div className="flex">
            {[1, 5, 12, 20].map((n) => (
              <div key={n} className="w-7 h-7 rounded-full border-2 border-void -ml-2 first:ml-0 bg-surface-3 overflow-hidden" />
            ))}
          </div>
          <p className="text-[13px] text-text-lo">
            <strong className="text-text-mid font-medium">120+ builders</strong> on the waitlist · Used by indie hackers &amp; AI engineers
          </p>
        </div>
      </div>

      {/* Canvas Preview */}
      <div className="max-w-[960px] mx-auto mt-[60px] px-8 fade-up visible">
        <div className="rounded-[16px] border border-[rgba(255,255,255,0.10)] bg-surface-0 overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_40px_80px_rgba(0,0,0,0.6)]">
          {/* Chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-surface-1">
            <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
            <span className="flex-1 text-center font-mono text-[11px] text-text-lo -ml-[38px]">orquestra — customer-feedback-pipeline.wf</span>
          </div>
          {/* Body */}
          <div className="grid grid-cols-[220px_1fr] h-[480px] max-md:grid-cols-1">
            {/* Sidebar */}
            <div className="border-r border-[rgba(255,255,255,0.06)] bg-surface-1 p-4 flex flex-col gap-4 overflow-hidden max-md:hidden">
              <span className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase text-text-lo pb-2 border-b border-[rgba(255,255,255,0.06)]">Node types</span>
              {[
                { label: 'Trigger', color: '#34d399' },
                { label: 'AI Step', color: '#818cf8' },
                { label: 'API Call', color: '#fbbf24' },
                { label: 'Condition', color: '#f87171' },
                { label: 'Output', color: '#6b7280' },
              ].map((n) => (
                <div key={n.label} className="flex items-center gap-[10px] px-[10px] py-2 rounded-[8px] border border-[rgba(255,255,255,0.06)] bg-surface-2 cursor-pointer text-[13px] text-text-mid hover:border-[rgba(255,255,255,0.16)] hover:bg-surface-3 hover:text-text-hi transition-all">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: n.color, boxShadow: `0 0 6px ${n.color}` }} />
                  <span>{n.label}</span>
                </div>
              ))}
              <div className="mt-auto p-[10px] bg-surface-3 rounded-[8px] border border-[rgba(255,255,255,0.06)]">
                <div className="font-mono text-[10px] text-text-lo mb-[6px]">EXECUTION</div>
                <div className="font-mono text-[11px] text-green flex items-center gap-[5px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-green shadow-[0_0_5px_#34d399] flex-shrink-0" />
                  Completed · 1.84s
                </div>
                <div className="font-mono text-[10px] text-text-lo mt-1">5 / 5 steps</div>
              </div>
            </div>
            {/* Stage */}
            <div className="relative bg-void overflow-hidden" style={{ height: 360 }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px]" />
              <CanvasNodes />
            </div>
          </div>
          {/* Log panel */}
          <div className="border-t border-[rgba(255,255,255,0.06)] bg-surface-0 px-[14px] py-[10px] font-mono text-[11px] h-[120px] overflow-hidden flex flex-col gap-1">
            {[
              { time: '10:00:00.012', node: '[trigger]', msg: 'received input ', val: '"Analyze this customer feedback..."' },
              { time: '10:00:00.015', node: '[ai_step]', msg: 'prompt resolved · calling gpt-4o-mini · temp=0.3' },
              { time: '10:00:01.240', node: '[ai_step]', msg: null, ok: '✓ complete', val: ' "sentiment: negative, actions: [follow-up...]"' },
              { time: '10:00:01.243', node: '[condition]', msg: 'field=sentiment, operator=equals, value="negative" → ', ok: 'true' },
              { time: '10:00:01.245', node: '[api_call]', msg: 'POST https://hooks.slack.com/...' },
            ].map((line, i) => (
              <div key={i} className="flex items-baseline gap-2 leading-[1.4]">
                <span className="text-text-lo shrink-0">{line.time}</span>
                <span className="text-indigo shrink-0">{line.node}</span>
                <span className="text-text-mid">{line.msg}</span>
                {line.val && <span className="text-cyan">{line.val}</span>}
                {line.ok && <span className="text-green">{line.ok}</span>}
                {i === 4 && <span className="inline-block w-[6px] h-[10px] bg-cyan align-middle ml-[2px] animate-[cursor-blink_1.1s_infinite]" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CanvasNodes() {
  const nodes = [
    { id: 'n1', left: 40, top: 60, icon: '#34d399', title: 'trigger', body: 'Manual run\ninput: customer_feedback', status: '12ms', color: '#34d399' },
    { id: 'n2', left: 260, top: 30, icon: '#818cf8', title: 'ai_step · gpt-4o-mini', body: 'Classify sentiment +\nextract action items', status: '1.2s', color: '#818cf8' },
    { id: 'n3', left: 260, top: 200, icon: '#f87171', title: 'condition', body: 'sentiment == "negative"', status: '→ true', color: '#f87171' },
    { id: 'n4', left: 480, top: 130, icon: '#fbbf24', title: 'api_call · slack', body: 'POST /webhooks/…\nbody: {{prev.output}}', status: 'running…', running: true, color: '#fbbf24' },
    { id: 'n5', left: 480, top: 300, icon: '#6b7280', title: 'output', body: 'label: "Done"', status: 'waiting', color: '#6b7280' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ width: '100%', height: '100%' }}>
        <defs>
          <marker id="arr-cyan" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="#22d3ee" strokeWidth="1" />
          </marker>
          <marker id="arr-gray" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="#6b7280" strokeWidth="1" />
          </marker>
        </defs>
        <path d="M 200 95 C 230 95, 240 80, 260 80" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        <path d="M 200 95 C 230 95, 240 240, 260 240" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
        <path d="M 340 115 L 340 200" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        <path d="M 420 225 C 450 225, 460 185, 480 185" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" markerEnd="url(#arr-cyan)" />
        <path d="M 420 255 C 450 255, 460 320, 480 320" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" markerEnd="url(#arr-gray)" />
        <path d="M 560 220 L 560 300" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute bg-surface-2 border border-[rgba(255,255,255,0.10)] rounded-[12px] w-[160px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          style={{
            left: n.left,
            top: n.top,
            borderColor: n.running ? '#22d3ee' : undefined,
            boxShadow: n.running ? '0 0 0 1px #22d3ee, 0 4px 24px rgba(34,211,238,0.2)' : undefined,
          }}
        >
          <div className="flex items-center gap-2 px-[10px] py-2 border-b border-[rgba(255,255,255,0.06)]">
            <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill={n.icon} /></svg>
            <span className="font-mono text-[10px] font-medium text-text-mid truncate flex-1">{n.title}</span>
          </div>
          <div className="px-[10px] py-2 font-mono text-[10px] text-text-lo leading-[1.5] whitespace-pre-line">
            {n.body}
          </div>
          <div className="flex items-center gap-1 px-[10px] pb-[6px] font-mono text-[10px]">
            <span className={`w-[5px] h-[5px] rounded-full ${n.running ? 'bg-cyan animate-[blink_1s_infinite]' : n.status === 'waiting' ? 'bg-text-lo' : 'bg-green'}`}
              style={n.running ? { boxShadow: '0 0 4px #22d3ee' } : n.status !== 'waiting' ? { boxShadow: '0 0 4px #34d399' } : undefined}
            />
            <span className={n.running ? 'text-cyan' : n.status === 'waiting' ? 'text-text-lo' : 'text-green'}>{n.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
