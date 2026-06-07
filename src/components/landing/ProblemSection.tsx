export function ProblemSection() {
  return (
    <section className="py-[120px] border-t border-[rgba(255,255,255,0.06)]" id="problem">
      <div className="max-w-[1120px] mx-auto px-8">
        <p className="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-text-lo mb-4 fade-up">Why Orquestra OS</p>
        <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] tracking-[-0.025em] text-text-hi max-w-[640px] mb-5 fade-up">Existing tools weren&apos;t built for AI-first workflows</h2>
        <p className="text-[17px] font-light text-text-mid max-w-[520px] leading-[1.7] mb-12 fade-up">Every category player leaves the same gaps. Orquestra OS was designed to close them.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-[rgba(255,255,255,0.06)] rounded-[16px] overflow-hidden stagger-fade">
          {[
            { tool: 'n8n / Zapier', title: 'AI is bolted on, not built in', desc: 'Every AI step is an island. No shared context, no prompt chaining, no reasoning across nodes. You\'re wiring duct tape between tools.' },
            { tool: 'LangChain / LangGraph', title: 'High floor, no visual debugging', desc: 'Powerful, but the entry cost is Python abstractions. When something breaks, you\'re reading raw logs with no step-level trace.' },
            { tool: 'Custom backends', title: 'You rebuild the same plumbing every time', desc: 'Retry logic. Context passing. Execution history. API adapters. You write it from scratch for every project.' },
          ].map((card, i) => (
            <div key={i} className="bg-surface-0 p-8 fade-up">
              <div className="font-mono text-[12px] font-medium text-text-lo tracking-[0.05em] mb-3">{card.tool}</div>
              <div className="w-5 h-5 rounded-full bg-[rgba(248,113,113,0.12)] border border-[rgba(248,113,113,0.2)] text-red text-[12px] text-center leading-[18px] mb-4">✕</div>
              <h3 className="font-display text-[16px] font-semibold text-text-hi mb-[10px] tracking-[-0.01em]">{card.title}</h3>
              <p className="text-[14px] font-light text-text-mid leading-[1.6]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
