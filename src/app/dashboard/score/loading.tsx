export default function Loading() {
  return <div className="p-6 max-w-4xl mx-auto animate-pulse">
    <div className="h-8 w-48 bg-[#0d1520] rounded-lg mb-8" />
    <div className="h-64 bg-[#0d1520] rounded-xl mb-6" />
    <div className="grid grid-cols-2 gap-4">
      <div className="h-40 bg-[#0d1520] rounded-xl" />
      <div className="h-40 bg-[#0d1520] rounded-xl" />
    </div>
  </div>;
}
