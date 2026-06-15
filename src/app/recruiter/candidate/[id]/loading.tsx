export default function CandidateProfileLoading() {
  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-[#0d1520] rounded-lg mb-6" />
        <div className="bg-[#0d1520] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-[#111d2e] rounded-xl" />
            <div className="flex-1">
              <div className="h-6 w-48 bg-[#111d2e] rounded mb-2" />
              <div className="h-4 w-32 bg-[#111d2e] rounded" />
            </div>
            <div className="w-24 h-24 bg-[#111d2e] rounded-xl" />
          </div>
          <div className="h-4 w-full bg-[#111d2e] rounded mb-2" />
          <div className="h-4 w-3/4 bg-[#111d2e] rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-48 bg-[#0d1520] rounded-xl" />
          <div className="h-48 bg-[#0d1520] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
