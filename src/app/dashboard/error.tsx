"use client";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="font-mono text-6xl mb-4">⚠</div>
        <h1 className="font-mono text-xl font-bold text-[#00FF41] mb-2">Erreur Dashboard</h1>
        <p className="font-mono text-sm text-gray-400 mb-6">Impossible de charger le contenu.</p>
        <button
          onClick={reset}
          className="font-mono text-sm px-6 py-3 bg-[#00FF41] text-[#080c14] font-bold rounded-lg hover:bg-[#00b884] transition"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
