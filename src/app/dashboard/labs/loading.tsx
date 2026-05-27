export default function Loading() {
  return <div className="p-6 max-w-4xl mx-auto animate-pulse">
    <div className="h-8 w-48 bg-[#0d1520] rounded-lg mb-8" />
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-24 bg-[#0d1520] rounded-xl" />
      ))}
    </div>
  </div>;
}
