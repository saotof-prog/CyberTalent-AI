export default function Loading() {
  return <div className="min-h-screen bg-[#080c14] p-6 animate-pulse">
    <div className="max-w-4xl mx-auto">
      <div className="h-8 w-48 bg-[#0d1520] rounded-lg mb-8" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[#0d1520] rounded-xl" />
        ))}
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="h-32 bg-[#0d1520] rounded-xl mb-3" />
      ))}
    </div>
  </div>;
}
