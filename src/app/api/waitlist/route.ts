import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { transporter } from "@/lib/email";
import { waitlistSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return Response.json(
      { success: false, message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return Response.json(
      { success: false, message: "Validation failed.", fieldErrors },
      { status: 400 }
    );
  }

  const { email, name, company, useCase } = parsed.data;
  const source =
    (body.source as string) ||
    request.nextUrl.searchParams.get("utm_source") ||
    request.nextUrl.searchParams.get("source") ||
    "direct";

  const { error: insertError } = await getSupabase()
    .from("waitlist")
    .insert([
      {
        email: email.toLowerCase(),
        name: name || null,
        company: company || null,
        use_case: useCase || null,
        source,
      },
    ])
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return Response.json(
        { success: false, message: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    console.error("Supabase insert error:", insertError);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  const from = process.env.SMTP_USER || "";

  if (transporter) {
    // Welcome email to the signup user
    try {
      await transporter.sendMail({
        from: `"Orqestra OS" <${from}>`,
        to: email,
        subject: "You're on the Orqestra waitlist",
        text: [
          `Hey,`,
          ``,
          `You're in.`,
          ``,
          `We'll let you know the moment early access opens.`,
          ``,
          `Why we're building Orqestra`,
          ``,
          `AI is powerful.`,
          ``,
          `But building with AI is chaos.`,
          ``,
          `Today your workflow probably looks like:`,
          ``,
          `ChatGPT → Claude → Cursor → GitHub → Notion → Zapier → another AI tool → back to ChatGPT.`,
          ``,
          `Every tool is isolated.`,
          `Nothing shares context.`,
          `Nothing works together.`,
          ``,
          `You spend more time moving information between tools than actually building.`,
          ``,
          `What Orqestra does`,
          ``,
          `Orqestra is the operating system for AI workflows.`,
          ``,
          `Connect your models, tools, APIs, agents, and automations in one place.`,
          ``,
          `Build workflows once.`,
          `Run them anywhere.`,
          `Monitor everything.`,
          ``,
          `Instead of:`,
          ``,
          `Idea → ChatGPT → Claude → Cursor → GitHub → Deployment`,
          ``,
          `You create:`,
          ``,
          `Idea → Build → Review → Deploy`,
          ``,
          `As a single workflow.`,
          ``,
          `What we're starting with`,
          ``,
          `Early access includes:`,
          ``,
          `✓ Visual workflow builder`,
          `✓ OpenAI & Claude integrations`,
          `✓ API integrations`,
          `✓ Conditional logic`,
          `✓ Execution monitoring`,
          `✓ Full workflow history`,
          `✓ Prebuilt templates`,
          `✓ Local-first development`,
          ``,
          `Who it's for`,
          `Solo founders`,
          `Indie hackers`,
          `AI builders`,
          `Automation engineers`,
          `Startups shipping with AI`,
          ``,
          `We're building this because AI tooling is fragmented.`,
          ``,
          `We think there should be one place where everything connects.`,
          ``,
          `If that's a problem you feel every day, you're exactly who we're building for.`,
          ``,
          `— Kirtan`,
          ``,
          `Founder, Orqestra`,
        ].join("\n"),
        html: [
          `<!DOCTYPE html>`,
          `<html>`,
          `<head><meta charset="utf-8"></head>`,
          `<body style="margin:0;padding:0;background:#0A0A0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">`,
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:48px 24px;">`,
          `<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#111118;border-radius:16px;border:1px solid #1E1E2E;overflow:hidden;">`,

          /* Header */
          `<tr><td style="padding:40px 40px 0;">`,
          `<table role="presentation" width="100%"><tr>`,
          `<td><svg width="160" height="40" viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg"><text x="0" y="46" font-family="system-ui,-apple-system,'Segoe UI',sans-serif" font-size="38" font-weight="400" fill="#F8FAFC" letter-spacing="-0.5">Orqestra</text><text x="0" y="68" font-family="system-ui,-apple-system,'Segoe UI',sans-serif" font-size="18" font-weight="500" fill="#6366F1" letter-spacing="3">OS</text></svg></td>`,
          `<td align="right"><span style="display:inline-block;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:4px;padding:2px 8px;font-size:10px;font-weight:600;color:#6366F1;letter-spacing:0.08em;">BETA</span></td>`,
          `</tr></table>`,
          `</td></tr>`,

          /* Divider */
          `<tr><td style="padding:24px 40px 0;"><div style="height:1px;background:#1E1E2E;"></div></td></tr>`,

          /* Hey */
          `<tr><td style="padding:24px 40px 0;font-size:15px;line-height:1.7;color:#94A3B8;">`,
          `<p style="margin:0 0 16px;">Hey,</p>`,
          `<p style="margin:0 0 16px;color:#F8FAFC;font-weight:600;font-size:17px;">You're in.</p>`,
          `<p style="margin:0 0 24px;">We'll let you know the moment early access opens.</p>`,
          `</td></tr>`,

          /* Why we're building */
          `<tr><td style="padding:0 40px;"><div style="height:1px;background:#1E1E2E;"></div></td></tr>`,
          `<tr><td style="padding:24px 40px 0;font-size:15px;line-height:1.7;color:#94A3B8;">`,
          `<h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:700;color:#F8FAFC;margin:0 0 16px;letter-spacing:-0.02em;">Why we're building Orqestra</h2>`,
          `<p style="margin:0 0 16px;">AI is powerful.</p>`,
          `<p style="margin:0 0 16px;">But building with AI is chaos.</p>`,
          `<p style="margin:0 0 16px;">Today your workflow probably looks like:</p>`,
          `<p style="margin:0 0 16px;font-family:monospace;color:#94A3B8;background:#0A0A0F;border:1px solid #1E1E2E;border-radius:8px;padding:12px 16px;">ChatGPT → Claude → Cursor → GitHub → Notion → Zapier → another AI tool → back to ChatGPT.</p>`,
          `<p style="margin:0 0 8px;">Every tool is isolated.</p>`,
          `<p style="margin:0 0 8px;">Nothing shares context.</p>`,
          `<p style="margin:0 0 16px;">Nothing works together.</p>`,
          `<p style="margin:0 0 24px;">You spend more time moving information between tools than actually building.</p>`,
          `</td></tr>`,

          /* What Orqestra does */
          `<tr><td style="padding:0 40px;"><div style="height:1px;background:#1E1E2E;"></div></td></tr>`,
          `<tr><td style="padding:24px 40px 0;font-size:15px;line-height:1.7;color:#94A3B8;">`,
          `<h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:700;color:#F8FAFC;margin:0 0 16px;letter-spacing:-0.02em;">What Orqestra does</h2>`,
          `<p style="margin:0 0 16px;font-size:16px;color:#F8FAFC;font-weight:500;">Orqestra is the operating system for AI workflows.</p>`,
          `<p style="margin:0 0 16px;">Connect your models, tools, APIs, agents, and automations in one place.</p>`,
          `<p style="margin:0 0 8px;">Build workflows once.</p>`,
          `<p style="margin:0 0 8px;">Run them anywhere.</p>`,
          `<p style="margin:0 0 24px;">Monitor everything.</p>`,

          `<p style="margin:0 0 16px;">Instead of:</p>`,
          `<p style="margin:0 0 16px;font-family:monospace;color:#6366F1;background:#0A0A0F;border:1px solid #1E1E2E;border-radius:8px;padding:12px 16px;">Idea → ChatGPT → Claude → Cursor → GitHub → Deployment</p>`,
          `<p style="margin:0 0 16px;">You create:</p>`,
          `<p style="margin:0 0 16px;font-family:monospace;color:#10B981;background:#0A0A0F;border:1px solid #1E1E2E;border-radius:8px;padding:12px 16px;">Idea → Build → Review → Deploy</p>`,
          `<p style="margin:0 0 24px;">As a single workflow.</p>`,
          `</td></tr>`,

          /* What we're starting with */
          `<tr><td style="padding:0 40px;"><div style="height:1px;background:#1E1E2E;"></div></td></tr>`,
          `<tr><td style="padding:24px 40px 0;font-size:15px;line-height:1.7;color:#94A3B8;">`,
          `<h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:700;color:#F8FAFC;margin:0 0 16px;letter-spacing:-0.02em;">What we're starting with</h2>`,
          `<p style="margin:0 0 16px;color:#F8FAFC;">Early access includes:</p>`,
          `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">`,
          ['Visual workflow builder', 'OpenAI & Claude integrations', 'API integrations', 'Conditional logic', 'Execution monitoring', 'Full workflow history', 'Prebuilt templates', 'Local-first development'].map(item => `<tr><td style="padding:4px 0;font-size:14px;color:#94A3B8;"><span style="color:#10B981;margin-right:8px;">✓</span>${item}</td></tr>`).join(''),
          `</table>`,
          `</td></tr>`,

          /* Who it's for */
          `<tr><td style="padding:0 40px;"><div style="height:1px;background:#1E1E2E;"></div></td></tr>`,
          `<tr><td style="padding:24px 40px 0;font-size:15px;line-height:1.7;color:#94A3B8;">`,
          `<h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:700;color:#F8FAFC;margin:0 0 16px;letter-spacing:-0.02em;">Who it's for</h2>`,
          `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">`,
          ['Solo founders', 'Indie hackers', 'AI builders', 'Automation engineers', 'Startups shipping with AI'].map(item => `<tr><td style="padding:4px 0;font-size:14px;color:#94A3B8;">${item}</td></tr>`).join(''),
          `</table>`,
          `</td></tr>`,

          /* Closing */
          `<tr><td style="padding:0 40px;"><div style="height:1px;background:#1E1E2E;"></div></td></tr>`,
          `<tr><td style="padding:24px 40px 40px;font-size:15px;line-height:1.7;color:#94A3B8;">`,
          `<p style="margin:0 0 16px;">We're building this because AI tooling is fragmented.</p>`,
          `<p style="margin:0 0 16px;">We think there should be one place where everything connects.</p>`,
          `<p style="margin:0 0 24px;">If that's a problem you feel every day, you're exactly who we're building for.</p>`,
          `<p style="margin:0 0 8px;color:#F8FAFC;">— Kirtan</p>`,
          `<p style="margin:0 0 0;color:#475569;">Founder, Orqestra</p>`,
          `</td></tr>`,

          `</table>`,
          /* Footer */
          `<table role="presentation" width="560" cellpadding="0" cellspacing="0">`,
          `<tr><td style="padding:16px 40px 0;text-align:center;font-size:11px;color:#475569;">`,
          `Orqestra OS — The Control Plane for AI Systems`,
          `</td></tr></table>`,

          `</td></tr></table>`,
          `</body>`,
          `</html>`,
        ].join('\n'),
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    // Notification to the team
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (notificationEmail) {
      try {
        await transporter.sendMail({
          from: `"Orqestra OS" <${from}>`,
          to: notificationEmail,
          subject: `New Waitlist Signup: ${email}`,
          text: [
            `New waitlist signup for Orqestra OS`,
            ``,
            `Email: ${email}`,
            `Name: ${name || "—"}`,
            `Company: ${company || "—"}`,
            `Use Case: ${useCase || "—"}`,
            `Source: ${source}`,
            ``,
            `View dashboard: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard`,
          ].join("\n"),
        });
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
      }
    }
  }

  return Response.json(
    {
      success: true,
      message: "You've been added to the waitlist!",
    },
    { status: 201 }
  );
}
