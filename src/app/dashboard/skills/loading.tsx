export default function Loading() {
  return (
    <div className="p-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-8 w-48 bg-[#0d1520] rounded-lg mb-8" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-20 bg-[#0d1520] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
