export default function Loading() {
  return <div className="p-6 max-w-4xl mx-auto animate-pulse">
    <div className="h-8 w-48 bg-[#0d1520] rounded-lg mb-8" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-28 bg-[#0d1520] rounded-xl mb-3" />
    ))}
  </div>;
}
