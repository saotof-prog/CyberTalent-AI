import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CertificationUpload from "@/components/CertificationUpload";
import CertVerifyButton from "@/components/CertVerifyButton";
import CertDeleteButton from "@/components/CertDeleteButton";

export default async function CertificationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidateProfile: { include: { certifications: true } } },
  });

  if (!user?.candidateProfile) redirect("/onboarding");
  const certs = user.candidateProfile.certifications;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-1">
          Mes <span className="text-[#00c896]">Certifications</span> 🏆
        </h1>
        <p className="font-mono text-xs text-gray-400">
          {certs.length} certification(s) ajoutée(s)
        </p>
      </div>

      {certs.length > 0 && (
        <div className="flex flex-col gap-3 mb-8">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#0d1520] border border-[#00c896]/20 rounded-xl p-5 flex items-center justify-between"
            >
              <div>
                <div className="font-mono text-base font-bold text-white">{cert.name}</div>
                <div className="font-mono text-xs text-gray-400">{cert.fullName}</div>
                <div className="font-mono text-xs text-gray-500 mt-1">
                  {cert.issuer} · {new Date(cert.issuedAt).toLocaleDateString("fr-FR")}
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    className="font-mono text-xs text-[#00c896] hover:underline"
                  >
                    Vérifier →
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div
                  className={`font-mono text-xs px-3 py-1 rounded-full ${
                    cert.status === "VERIFIED"
                      ? "border-[#00c896] text-[#00c896] bg-[#00c896]/10"
                      : cert.status === "REJECTED"
                        ? "border-[#ff4060] text-[#ff4060] bg-[#ff4060]/10"
                        : cert.status === "VERIFYING"
                          ? "border-[#ffaa00] text-[#ffaa00] bg-[#ffaa00]/10"
                          : "border-[#ffaa00] text-[#ffaa00] bg-[#ffaa00]/10"
                  }`}
                >
                  {cert.status === "VERIFIED"
                    ? "✓ Vérifié"
                    : cert.status === "REJECTED"
                      ? "✗ Rejeté"
                      : "⏳ En attente"}
                </div>
                {cert.platform && (
                  <div className="font-mono text-[10px] text-[#00c896] mt-1">
                    Plateforme: {cert.platform}
                  </div>
                )}
                {cert.platformSpecificData &&
                  typeof cert.platformSpecificData === "object" &&
                  Object.keys(cert.platformSpecificData).length > 0 && (
                    <div className="font-mono text-[10px] text-[#00c896] mt-1 max-w-xs">
                      Détails: {JSON.stringify(cert.platformSpecificData)}
                    </div>
                  )}
              </div>
              <div className="flex items-center gap-2">
                {cert.status === "PENDING" && <CertVerifyButton certId={cert.id} />}
                <CertDeleteButton certId={cert.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      <CertificationUpload />
    </div>
  );
}
