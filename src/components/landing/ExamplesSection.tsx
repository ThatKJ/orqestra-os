export function ExamplesSection() {
  return (
    <section className="py-[120px] border-t border-[rgba(255,255,255,0.06)]" id="workflows">
      <div className="max-w-[1120px] mx-auto px-8">
        <p className="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-text-lo mb-4 fade-up">Ships with these</p>
        <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] tracking-[-0.025em] text-text-hi max-w-[640px] mb-5 fade-up">3 production workflows, ready to run</h2>
        <p className="text-[17px] font-light text-text-mid max-w-[520px] leading-[1.7] mb-12 fade-up">Fork, modify, ship. Every workflow is stored as JSON and fully editable on the canvas.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-[rgba(255,255,255,0.06)] rounded-[16px] overflow-hidden stagger-fade">
          {[
            {
              num: 'workflow 01',
              title: 'Summarize & Slack Notify',
              desc: 'Summarize any text input with AI, detect urgency via a condition branch, and POST to Slack if the flag is raised.',
              flows: [
                { label: 'Trigger', color: '#34d399' },
                { label: 'AI: Summarize (gpt-4o-mini)', color: '#818cf8' },
                { label: 'Condition: Is urgent?', color: '#f87171' },
                { label: 'API: POST to Slack', color: '#fbbf24' },
                { label: 'Output: Done', color: '#6b7280' },
              ],
            },
            {
              num: 'workflow 02',
              title: 'Customer Feedback Analyzer',
              desc: 'Classify sentiment, extract action items, and push the results to a Notion database or any webhook endpoint.',
              flows: [
                { label: 'Trigger', color: '#34d399' },
                { label: 'AI: Classify sentiment', color: '#818cf8' },
                { label: 'AI: Extract action items', color: '#818cf8' },
                { label: 'API: Save to Notion', color: '#fbbf24' },
                { label: 'Output: Done', color: '#6b7280' },
              ],
            },
            {
              num: 'workflow 03',
              title: 'Content Pipeline',
              desc: 'Generate a blog outline with one AI node, then pass that outline into a second AI node to write the full intro paragraph.',
              flows: [
                { label: 'Trigger', color: '#34d399' },
                { label: 'AI: Generate blog outline', color: '#818cf8' },
                { label: 'AI: Write intro from outline', color: '#818cf8' },
                { label: 'Output: Done', color: '#6b7280' },
              ],
            },
          ].map((ex, i) => (
            <div key={i} className="bg-surface-0 p-8 flex flex-col gap-5 fade-up">
              <div className="font-mono text-[10px] text-text-lo tracking-[0.1em] uppercase">{ex.num}</div>
              <h3 className="font-display text-[17px] font-semibold text-text-hi tracking-[-0.01em] leading-[1.3]">{ex.title}</h3>
              <p className="text-[13px] font-light text-text-mid leading-[1.6]">{ex.desc}</p>
              <div className="flex flex-col gap-[6px]">
                {ex.flows.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: f.color }} />
                    <span className="text-text-mid">
                      {f.label}
                      {j < ex.flows.length - 1 && <span className="text-text-lo ml-[3px]">──</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
