import { getSupabaseAdmin } from "@/lib/supabase";
import { Badge } from "@/components/ui/Badge";
import { DashboardClient } from "./DashboardClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 15;
  const offset = (page - 1) * limit;
  const search = params.search || "";
  const sortBy = params.sortBy || "created_at";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const sb = getSupabaseAdmin().from("waitlist");
  let query = sb
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `email.ilike.%${search}%,name.ilike.%${search}%,company.ilike.%${search}%,use_case.ilike.%${search}%`
    );
  }

  const { data: entries, count, error } = await query
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Dashboard fetch error:", error);
  }

  const { data: rawEntries } = await getSupabaseAdmin()
    .from("waitlist")
    .select("source");

  const allEntries = rawEntries as { source: string }[] | null;

  const totalSignups = count || 0;
  const sourceBreakdown: Record<string, number> = {};

  if (allEntries) {
    for (const entry of allEntries) {
      const src = entry.source || "direct";
      sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
    }
  }

  const totalPages = Math.ceil(totalSignups / limit);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[#262626] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-on-surface">Dashboard</h1>
            <p className="text-sm text-on-surface-variant">
              Orqestra OS Waitlist
            </p>
          </div>
          <Badge variant="primary">{totalSignups} signups</Badge>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Signups"
            value={totalSignups.toLocaleString()}
          />
          <StatCard
            label="Sources Tracked"
            value={Object.keys(sourceBreakdown).length.toString()}
          />
          <StatCard
            label="Page Size"
            value={`${limit}`}
          />
          <StatCard
            label="Current Page"
            value={`${page} of ${totalPages || 1}`}
          />
        </div>

        <div className="mt-8">
          <DashboardClient
            entries={entries || []}
            totalPages={totalPages}
            currentPage={page}
            currentSearch={search}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            sourceBreakdown={sourceBreakdown}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#262626] bg-surface-container p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-on-surface">{value}</p>
    </div>
  );
}
