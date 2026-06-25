export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
        <span className="font-mono text-xs text-gray-500">Chargement...</span>
      </div>
    </div>
  );
}
