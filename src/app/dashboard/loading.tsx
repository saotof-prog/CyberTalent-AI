export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-64 bg-[#0d1520] rounded-lg mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-[#0d1520] rounded-xl" />
          ))}
        </div>
        <div className="h-48 bg-[#0d1520] rounded-xl mb-8" />
        <div className="h-64 bg-[#0d1520] rounded-xl" />
      </div>
    </div>
  );
}
