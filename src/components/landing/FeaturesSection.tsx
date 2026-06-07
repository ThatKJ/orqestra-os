export function FeaturesSection() {
  return (
    <section className="py-[120px] border-t border-[rgba(255,255,255,0.06)]" id="features">
      <div className="max-w-[1120px] mx-auto px-8">
        <p className="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-text-lo mb-4 fade-up">What you get</p>
        <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] tracking-[-0.025em] text-text-hi max-w-[640px] mb-5 fade-up">Everything the execution layer needs. Nothing it doesn&apos;t.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-[rgba(255,255,255,0.06)] rounded-[16px] overflow-hidden mt-16 stagger-fade">
          {[
            {
              icon: 'M2 2h6v6H2zM12 2h6v6h-6zM7 12h6v6H7z',
              iconColor: '#818cf8',
              bgColor: 'rgba(129,140,248,0.12)',
              borderColor: 'rgba(129,140,248,0.2)',
              title: 'Visual workflow builder',
              desc: 'Drag, connect, configure. Build multi-step AI pipelines on a canvas without writing boilerplate. React Flow canvas with 5 node types designed for AI-first work.',
              demo: [
                { cm: '// 5 node types, zero abstractions' },
                { kw: 'trigger', arrow: true },
                { kw: 'ai_step', arrow: true },
                { kw: 'condition' },
                { lo: '           ↓ true  ↓ false' },
                { kw: '           api_call → output' },
              ],
            },
            {
              icon: 'M4 10h12M14 7l3 3-3 3M4 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z',
              iconColor: '#22d3ee',
              bgColor: 'rgba(34,211,238,0.12)',
              borderColor: 'rgba(34,211,238,0.2)',
              title: 'Native context passing',
              desc: 'Every step\'s output is accessible to the next with {{prev.output}}. Context flows naturally across AI calls, API bodies, and conditions — no glue code.',
              demo: [
                { cm: '// prompt template' },
                { str: '"Summarize in 3 bullets:\n {{prev.output}}"', lo: '' },
                { cm: '// in API body too' },
                { kw: '{"text"', str: ': "{{prev.output}}"', kw2: '}' },
              ],
            },
            {
              icon: 'M4 14l4-4 3 3 5-6M4 2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z',
              iconColor: '#34d399',
              bgColor: 'rgba(52,211,153,0.12)',
              borderColor: 'rgba(52,211,153,0.2)',
              title: 'Per-step execution trace',
              desc: 'Every run is fully logged. See each node\'s input, output, duration, status, and retry count. No more digging through raw logs when something breaks.',
              demo: [
                { ok: '✓ trigger', num: '12ms' },
                { ok: '✓ ai_step', num: '1.2s' },
                { ok: '✓ condition', num: '0ms' },
                { cyan: '→ api_call', lo: 'running…' },
                { lo: '· output', lo2: 'waiting' },
              ],
            },
            {
              icon: 'M10 3v2m0 10v2M3 10h2m10 0h2M5.5 5.5l1.5 1.5m7 7l1.5 1.5M5.5 14.5l1.5-1.5m7-7l1.5-1.5',
              iconColor: '#fbbf24',
              bgColor: 'rgba(251,191,36,0.12)',
              borderColor: 'rgba(251,191,36,0.2)',
              title: 'Built-in retry + SSE streaming',
              desc: 'Failed steps auto-retry once. Execution streams in real-time via SSE — every node lights up as it runs, and errors surface immediately with full context.',
              demo: [
                { kw: 'event:', str: ' step_start' },
                { kw: 'data:', num: ' {nodeId: "n4", …}' },
                {},
                { kw: 'event:', str: ' step_retry' },
                { kw: 'data:', num: ' {attempt: 1, error: …}' },
                { kw: 'event:', str: ' step_complete' },
              ],
            },
          ].map((f, i) => (
            <div key={i} className="bg-surface-0 p-10 flex flex-col gap-4 fade-up">
              <div className="w-10 h-10 rounded-[8px] flex items-center justify-center" style={{ background: f.bgColor, border: `1px solid ${f.borderColor}` }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d={f.icon} stroke={f.iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-display text-[18px] font-semibold text-text-hi tracking-[-0.01em]">{f.title}</h3>
              <p className="text-[14px] font-light text-text-mid leading-[1.7]">{f.desc}</p>
              <div className="mt-2 rounded-[8px] bg-surface-1 border border-[rgba(255,255,255,0.06)] overflow-hidden">
                <div className="flex items-center gap-[6px] px-[10px] py-[6px] border-b border-[rgba(255,255,255,0.06)] bg-surface-2">
                  <div className="w-[5px] h-[5px] rounded-full bg-[#f87171]" />
                  <div className="w-[5px] h-[5px] rounded-full bg-[#fbbf24]" />
                  <div className="w-[5px] h-[5px] rounded-full bg-[#34d399]" />
                </div>
                <div className="p-3 font-mono text-[11px] leading-[1.6] text-text-lo whitespace-pre">
                  {f.demo.map((line: Record<string, string | boolean | undefined>, j: number) => (
                    <div key={j}>
                      {line.cm && <span className="italic text-text-lo">{"// " + (line.cm as string)}</span>}
                      {line.kw && <span className="text-indigo">{line.kw}</span>}
                      {line.kw2 && <span className="text-indigo">{line.kw2}</span>}
                      {line.str && <span className="text-cyan">{line.str}</span>}
                      {line.num && <span className="text-amber">{line.num}</span>}
                      {line.ok && <span className="text-green">{line.ok}</span>}
                      {line.cyan && <span className="text-cyan">{line.cyan}</span>}
                      {line.lo && <span className="text-text-lo">{line.lo}</span>}
                      {line.lo2 && <span className="text-text-lo">{line.lo2}</span>}
                      {line.arrow && <span> → </span>}
                      {!line.cm && !line.kw && !line.str && !line.num && !line.ok && !line.cyan && !line.lo && !line.lo2 && !line.arrow && !line.kw2 && j > 0 && <span>&nbsp;</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
