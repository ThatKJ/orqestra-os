export default function PrivacyPage() {
  return (
    <main className="pt-32 pb-20">
      <div className="max-w-[720px] mx-auto px-8">
        <h1 className="font-display text-[clamp(28px,4vw,42px)] font-bold text-text-hi mb-8">Privacy Policy</h1>
        <div className="font-body text-[15px] text-text-mid leading-[1.8] space-y-4">
          <p><strong className="text-text-hi">Information We Collect.</strong> When you sign up for the Orqestra OS waitlist, we collect your email address and optionally your name, company, and use case. We also collect basic analytics via Plausible (anonymous page views, no cookies).</p>
          <p><strong className="text-text-hi">How We Use It.</strong> Your email is used solely to notify you when early access opens. We do not share, sell, or rent your personal data to third parties.</p>
          <p><strong className="text-text-hi">Data Storage.</strong> Data is stored in Supabase (PostgreSQL) with row-level security. Only authenticated admin users can access the waitlist dashboard.</p>
          <p><strong className="text-text-hi">Retention.</strong> We retain your data until you request removal. Email us at orqestra.team@gmail.com to delete your information.</p>
          <p><strong className="text-text-hi">Contact.</strong> For questions, reach out to orqestra.team@gmail.com.</p>
        </div>
      </div>
    </main>
  );
}
