export function TraceSection() {
  return (
    <section className="py-[120px] border-t border-[rgba(255,255,255,0.06)]" id="trace-section">
      <div className="max-w-[1120px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_440px] gap-16 items-center">
          <div>
            <p className="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-text-lo mb-4 fade-up">Full observability</p>
            <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] tracking-[-0.025em] text-text-hi max-w-[640px] mb-5 fade-up">Know exactly what happened and why</h2>
            <p className="text-[17px] font-light text-text-mid max-w-[520px] leading-[1.7] mb-12 fade-up">Every execution is stored with a complete step-by-step log. Input, output, duration, and status for every node. One click to see why a workflow failed.</p>
            <div className="flex flex-col gap-4 fade-up">
              {[
                { title: 'Real-time node highlighting', desc: 'Nodes light up as they run. Active node glows cyan. Completed nodes turn green. Errors turn red immediately.' },
                { title: 'Full execution history', desc: 'Every past run is stored in SQLite. Replay any execution to see exactly what flowed through each node.' },
                { title: 'Auto-retry with visibility', desc: 'Failed steps retry once automatically. Retry attempts are logged with the original error so you always know what went wrong.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[rgba(34,211,238,0.12)] border border-[rgba(34,211,238,0.2)] flex items-center justify-center shrink-0 mt-[1px]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-text-hi mb-[3px]">{item.title}</div>
                    <div className="text-[13px] font-light text-text-mid">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Trace Panel */}
          <div className="rounded-[16px] border border-[rgba(255,255,255,0.10)] bg-surface-0 overflow-hidden fade-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-surface-1">
              <span className="font-mono text-[11px] font-medium text-text-lo tracking-[0.08em] uppercase">Execution log · ex_xyz789</span>
              <div className="flex items-center gap-[5px] font-mono text-[10px] text-green">
                <span className="w-[5px] h-[5px] rounded-full bg-green shadow-[0_0_5px_#34d399]" />
                success · 1.84s
              </div>
            </div>
            {[
              { icon: 'T', bg: 'rgba(52,211,153,0.12)', color: '#34d399', name: 'trigger · Start', io: 'in: "Analyze this customer feedback…" → out: same', ms: '12ms', badge: 'ok', badgeType: 'success' },
              { icon: 'AI', bg: 'rgba(129,140,248,0.12)', color: '#818cf8', name: 'ai_step · Classify Sentiment', io: 'in: prompt+context → out: "sentiment: negative…"', ms: '1,210ms', badge: 'ok', badgeType: 'success' },
              { icon: 'C', bg: 'rgba(248,113,113,0.12)', color: '#f87171', name: 'condition · Is Negative?', io: 'field=sentiment, equals "negative" → branch: true', ms: '1ms', badge: 'ok', badgeType: 'success' },
              { icon: '↗', bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', name: 'api_call · Alert Slack', io: 'POST hooks.slack.com/… → 200 OK', ms: '614ms', badge: 'live', badgeType: 'active' },
              { icon: '◎', bg: 'rgba(107,114,128,0.12)', color: '#6b7280', name: 'output · Done', io: 'waiting for upstream', ms: '—', badge: 'idle', badgeType: 'idle' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-[14px] border-b border-[rgba(255,255,255,0.06)] last:border-none hover:bg-surface-1 transition-colors">
                <div className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 mt-[1px] font-mono text-[11px] font-medium" style={{ background: step.bg, color: step.color }}>{step.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[12px] font-medium text-text-hi mb-[3px]">{step.name}</div>
                  <div className="font-mono text-[10px] text-text-lo truncate">{step.io}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-mono text-[10px] text-text-lo">{step.ms}</span>
                  <span className={`font-mono text-[9px] font-medium px-[6px] py-[2px] rounded-full uppercase tracking-[0.06em] ${
                    step.badgeType === 'success' ? 'bg-[rgba(52,211,153,0.12)] text-green border border-[rgba(52,211,153,0.2)]' :
                    step.badgeType === 'active' ? 'bg-[rgba(34,211,238,0.12)] text-cyan border border-[rgba(34,211,238,0.2)]' :
                    'bg-[rgba(107,114,128,0.12)] text-gray border border-[rgba(107,114,128,0.2)]'
                  }`}>{step.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
