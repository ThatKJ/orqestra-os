"use client";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.85)] backdrop-blur-[20px]">
      <div className="flex items-center justify-between h-14 max-w-[1120px] mx-auto px-8">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-display font-bold text-[18px] tracking-[-0.02em] text-text-hi bg-transparent border-none cursor-pointer">
          Orquestra OS<span className="text-cyan">.</span>
        </button>
        <ul className="hidden md:flex items-center gap-8 list-none">
          <li><button onClick={() => scrollTo("product")} className="text-[14px] text-text-mid hover:text-text-hi transition-colors bg-transparent border-none cursor-pointer">Product</button></li>
          <li><button onClick={() => scrollTo("features")} className="text-[14px] text-text-mid hover:text-text-hi transition-colors bg-transparent border-none cursor-pointer">Features</button></li>
          <li><button onClick={() => scrollTo("workflows")} className="text-[14px] text-text-mid hover:text-text-hi transition-colors bg-transparent border-none cursor-pointer">Workflows</button></li>
        </ul>
        <div className="flex items-center gap-3">
          <a href="https://github.com/ThatKJ/orquestra-os" target="_blank" rel="noopener" className="font-body text-[14px] text-text-mid hover:text-text-hi hover:bg-surface-2 transition-colors bg-transparent border-none cursor-pointer px-3 py-1.5 rounded-[8px] no-underline">
            GitHub
          </a>
          <button
            onClick={() => scrollTo("waitlist")}
            className="font-body text-[14px] font-medium text-[#001f25] bg-cyan border-none cursor-pointer px-[18px] py-2 rounded-[8px] hover:opacity-90 active:scale-[0.98] transition-all tracking-[-0.01em]"
          >
            Get early access
          </button>
        </div>
      </div>
    </nav>
  );
}
