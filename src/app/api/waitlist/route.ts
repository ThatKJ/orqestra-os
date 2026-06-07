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
        from: `"Orquestra OS" <${from}>`,
        to: email,
        subject: "You're on the Orquestra OS waitlist",
        text: [
          `Hey,`,
          ``,
          `You're in. We'll reach out the moment early access opens.`,
          ``,
          `Here's what you signed up for:`,
          ``,
          `Orquestra OS is a visual workflow builder where AI is a first-class primitive — not bolted on. You connect triggers, AI steps, API calls, and conditional logic on a canvas. Every execution is fully traced: input, output, duration, and status for every node.`,
          ``,
          `No Python boilerplate. No duct-taping n8n with GPT. Just build the workflow, hit Run, and watch it execute.`,
          ``,
          `---`,
          ``,
          `What ships in the MVP:`,
          ``,
          `→ Visual canvas with 5 node types (Trigger, AI Step, API Call, Condition, Output)`,
          `→ Native context passing with {{prev.output}} between steps`,
          `→ Real-time execution log via SSE — every node lights up as it runs`,
          `→ Per-step trace: input, output, duration, retry count`,
          `→ 3 prebuilt example workflows ready to fork`,
          `→ Runs locally — no auth, no cloud, no setup beyond cloning the repo`,
          ``,
          `---`,
          ``,
          `We ship in 2 weeks.`,
          ``,
          `If you want to follow the build, reply to this email. Happy to keep you in the loop.`,
          ``,
          `— Orquestra OS`,
        ].join("\n"),
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    // Notification to the team
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (notificationEmail) {
      try {
        await transporter.sendMail({
          from: `"Orquestra OS" <${from}>`,
          to: notificationEmail,
          subject: `New Waitlist Signup: ${email}`,
          text: [
            `New waitlist signup for Orquestra OS`,
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
