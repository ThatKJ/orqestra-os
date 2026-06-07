export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] py-10">
      <div className="max-w-[1120px] mx-auto px-8">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="font-display font-bold text-[16px] tracking-[-0.02em] text-text-hi">
              Orquestra OS<span className="text-cyan">.</span>
            </div>
            <p className="font-mono text-[12px] text-text-lo mt-[6px]">The execution layer for AI workflows.</p>
          </div>
          <ul className="flex items-center gap-6 list-none">
            {[
              { label: 'GitHub', href: 'https://github.com' },
              { label: 'Changelog', href: '#' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-[13px] text-text-lo hover:text-text-mid transition-colors no-underline">{link.label}</a>
              </li>
            ))}
          </ul>
          <p className="font-mono text-[12px] text-text-lo">© 2026 Orquestra OS. MIT Licensed.</p>
        </div>
      </div>
    </footer>
  );
}
