export default function JobApplicationsLoading() {
  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-8 w-64 bg-[#0d1520] rounded-lg mb-6" />
        <div className="h-6 w-96 bg-[#0d1520] rounded mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-[#0d1520] rounded-xl mb-3" />
        ))}
      </div>
    </div>
  );
}
