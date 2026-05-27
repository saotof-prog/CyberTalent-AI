export default function Loading() {
  return <div className="min-h-screen bg-[#080c14] p-6 animate-pulse">
    <div className="max-w-7xl mx-auto">
      <div className="h-8 w-64 bg-[#0d1520] rounded-lg mb-8" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-28 bg-[#0d1520] rounded-xl mb-3" />
      ))}
    </div>
  </div>;
}
