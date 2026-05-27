"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="font-mono text-6xl mb-4">⚠</div>
        <h1 className="font-mono text-xl font-bold text-[#ff4060] mb-2">
          Erreur
        </h1>
        <p className="font-mono text-sm text-gray-400 mb-6">
          Une erreur inattendue s&apos;est produite.
        </p>
        <button
          onClick={reset}
          className="font-mono text-sm px-6 py-3 bg-[#ff4060] text-white rounded-lg hover:bg-[#ff2040] transition"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
