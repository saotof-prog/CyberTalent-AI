"use client";

interface AnalyticsData {
  jobs: { total: number; active: number };
  applications: {
    total: number;
    last30d: number;
    funnel: Record<string, number>;
    byDay: { date: string; count: number }[];
  };
  savedCandidates: number;
  searchesPerformed: number;
  candidatePool: { averageScore: number; total: number };
  topSkills: { name: string; count: number }[];
  recentApplications: {
    id: string;
    jobTitle: string;
    status: string;
    appliedAt: string;
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  VIEWED: "Consultée",
  SHORTLISTED: "Présélectionnée",
  INTERVIEW: "Entretien",
  OFFER: "Offre",
  REJECTED: "Refusée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500",
  VIEWED: "bg-blue-500",
  SHORTLISTED: "bg-purple-500",
  INTERVIEW: "bg-indigo-500",
  OFFER: "bg-[#00c896]",
  REJECTED: "bg-[#ff4060]",
};

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#0d1520] border border-[#00c896]/10 rounded-xl p-5">
      <div className="font-mono text-xs text-gray-500 mb-2">{label}</div>
      <div className={`font-mono text-2xl md:text-3xl font-bold ${color ?? "text-white"}`}>
        {value}
      </div>
      {sub && <div className="font-mono text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

export default function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const maxCount = Math.max(...data.applications.byDay.map((d) => d.count), 1);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl md:text-3xl font-bold text-white mb-1">
          📊 Tableau de <span className="text-[#ff4060]">Bord</span>
        </h1>
        <p className="font-mono text-xs text-gray-400">
          Vue d&apos;ensemble de ton activité recrutement
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard
          label="Candidatures reçues"
          value={data.applications.total}
          sub={`${data.applications.last30d} ces 30 jours`}
          color="text-[#0084ff]"
        />
        <StatCard
          label="Offres publiées"
          value={`${data.jobs.active}/${data.jobs.total}`}
          sub="actives / total"
          color="text-[#00c896]"
        />
        <StatCard
          label="Candidats sauvegardés"
          value={data.savedCandidates}
          sub="dans ta shortlist"
          color="text-[#ffaa00]"
        />
        <StatCard
          label="Score moyen du pool"
          value={data.candidatePool.averageScore}
          sub={`sur ${data.candidatePool.total} candidats`}
          color="text-[#ff4060]"
        />
      </div>

      {/* Funnel & Sparkline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        {/* Funnel */}
        <div className="bg-[#0d1520] border border-[#00c896]/10 rounded-xl p-5">
          <h2 className="font-mono text-sm font-bold text-white mb-4">Entonnoir des candidatures</h2>
          <div className="flex flex-col gap-2">
            {Object.entries(data.applications.funnel).map(([key, count]) => {
              const pct =
                data.applications.total > 0
                  ? Math.round((count / data.applications.total) * 100)
                  : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[key] ?? "bg-gray-500"}`} />
                      <span className="font-mono text-xs text-gray-400">
                        {STATUS_LABELS[key] ?? key}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-white font-bold">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-[#111d2e] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${STATUS_COLORS[key] ?? "bg-gray-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sparkline: apps last 30 days */}
        <div className="bg-[#0d1520] border border-[#00c896]/10 rounded-xl p-5">
          <h2 className="font-mono text-sm font-bold text-white mb-4">
            Candidatures — 30 derniers jours
          </h2>
          <div className="flex items-end gap-[2px] h-32">
            {data.applications.byDay.map((d) => (
              <div
                key={d.date}
                className="flex-1 bg-[#0084ff]/40 rounded-t hover:bg-[#0084ff]/60 transition relative group"
                style={{ height: `${(d.count / maxCount) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {d.count}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[10px] text-gray-600">
              {data.applications.byDay[0]?.date ?? ""}
            </span>
            <span className="font-mono text-[10px] text-gray-600">
              {data.applications.byDay[data.applications.byDay.length - 1]?.date ?? ""}
            </span>
          </div>
        </div>
      </div>

      {/* Top Skills & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top skills */}
        <div className="bg-[#0d1520] border border-[#00c896]/10 rounded-xl p-5">
          <h2 className="font-mono text-sm font-bold text-white mb-4">
            Compétences les plus recherchées
          </h2>
          {data.topSkills.length === 0 ? (
            <p className="font-mono text-xs text-gray-500">Aucune donnée disponible</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.topSkills.map((s, i) => {
                const max = data.topSkills[0].count;
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-400 w-4">{i + 1}.</span>
                        <span className="font-mono text-xs text-white">{s.name}</span>
                      </div>
                      <span className="font-mono text-xs text-gray-500">{s.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#111d2e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ff4060] rounded-full"
                        style={{ width: `${(s.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent applications */}
        <div className="bg-[#0d1520] border border-[#00c896]/10 rounded-xl p-5">
          <h2 className="font-mono text-sm font-bold text-white mb-4">
            Dernières candidatures
          </h2>
          {data.recentApplications.length === 0 ? (
            <p className="font-mono text-xs text-gray-500">Aucune candidature pour le moment</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between py-2 border-b border-[#00c896]/5 last:border-0"
                >
                  <div>
                    <div className="font-mono text-xs text-white">{app.jobTitle}</div>
                    <div className="font-mono text-[10px] text-gray-500 mt-0.5">
                      {new Date(app.appliedAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-1 rounded-full ${
                      app.status === "OFFER"
                        ? "bg-[#00c896]/10 text-[#00c896]"
                        : app.status === "REJECTED"
                          ? "bg-[#ff4060]/10 text-[#ff4060]"
                          : app.status === "INTERVIEW"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {STATUS_LABELS[app.status] ?? app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
