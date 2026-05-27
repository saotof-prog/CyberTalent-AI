import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="font-mono text-[#00c896] text-sm mb-4">// 404</div>
        <h1 className="font-mono text-7xl md:text-9xl font-bold text-white mb-4">
          4<span className="text-[#00c896]">0</span>4
        </h1>
        <div className="w-16 h-1 bg-[#00c896]/30 mx-auto mb-6" />
        <p className="font-mono text-sm text-gray-400 mb-8 leading-relaxed">
          Page non trouvée. Le chemin que tu cherches n&apos;existe pas ou a été déplacé.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="font-mono text-sm px-6 py-3 bg-[#00c896] text-black font-bold rounded-xl hover:bg-[#00ff9d] transition"
          >
            ← Retour à l&apos;accueil
          </Link>
          <Link
            href="/dashboard"
            className="font-mono text-sm px-6 py-3 border border-[#00c896]/30 text-[#00c896] rounded-xl hover:bg-[#00c896]/10 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
