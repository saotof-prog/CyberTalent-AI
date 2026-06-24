import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminCertVerifyActions from "./verify-actions";

export default async function AdminCertDetailPage(props: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await props.params;

  const cert = await prisma.certification.findUnique({
    where: { id },
    include: {
      candidate: {
        include: { user: true },
      },
    },
  });

  if (!cert) notFound();

  const statusColor: Record<string, string> = {
    PENDING: "border-[#ffaa00] text-[#ffaa00]",
    VERIFYING: "border-[#0084ff] text-[#0084ff]",
    VERIFIED: "border-[#00c896] text-[#00c896]",
    REJECTED: "border-[#ff4060] text-[#ff4060]",
    EXPIRED: "border-gray-500 text-gray-500",
  };

  const isPending = cert.status === "PENDING" || cert.status === "VERIFYING";

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/certifications"
          className="font-mono text-xs text-gray-500 hover:text-white transition"
        >
          ← Retour certifications
        </Link>
        <h1 className="font-mono text-2xl font-bold text-white mt-2">
          🏆 {cert.name}
        </h1>
        <p className="font-mono text-xs text-gray-400">{cert.fullName || cert.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 space-y-3">
          <h2 className="font-mono text-sm text-[#0084ff]">Informations</h2>
          <div className="space-y-2">
            <div>
              <span className="font-mono text-xs text-gray-500">Statut</span>
              <div>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded-full border ${statusColor[cert.status] ?? "border-gray-500 text-gray-500"}`}
                >
                  {cert.status}
                </span>
              </div>
            </div>
            <div>
              <span className="font-mono text-xs text-gray-500">Organisme</span>
              <div className="font-mono text-sm text-white">{cert.issuer}</div>
            </div>
            <div>
              <span className="font-mono text-xs text-gray-500">Date d&apos;obtention</span>
              <div className="font-mono text-sm text-white">
                {new Date(cert.issuedAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
            {cert.expiresAt && (
              <div>
                <span className="font-mono text-xs text-gray-500">Expire le</span>
                <div className="font-mono text-sm text-white">
                  {new Date(cert.expiresAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            )}
            <div>
              <span className="font-mono text-xs text-gray-500">Plateforme</span>
              <div className="font-mono text-sm text-white">{cert.platform || "—"}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 space-y-3">
          <h2 className="font-mono text-sm text-[#0084ff]">Candidat</h2>
          <div className="space-y-2">
            <div>
              <span className="font-mono text-xs text-gray-500">Nom</span>
              <div className="font-mono text-sm text-white">
                {cert.candidate.firstName} {cert.candidate.lastName}
              </div>
            </div>
            <div>
              <span className="font-mono text-xs text-gray-500">Email</span>
              <div className="font-mono text-sm text-white">{cert.candidate.user.email}</div>
            </div>
            <div>
              <span className="font-mono text-xs text-gray-500">CyberScore</span>
              <div className="font-mono text-sm text-[#0084ff]">{cert.candidate.cyberScore}</div>
            </div>
          </div>
        </div>
      </div>

      {cert.credentialUrl && (
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 mb-4">
          <h2 className="font-mono text-sm text-[#0084ff] mb-2">Lien de vérification</h2>
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-[#0084ff] hover:underline break-all"
          >
            {cert.credentialUrl}
          </a>
        </div>
      )}

      {cert.aiNotes && (
        <div className="bg-[#0d1520] border border-[#0084ff]/20 rounded-xl p-4 mb-4">
          <h2 className="font-mono text-sm text-[#0084ff] mb-2">Notes IA</h2>
          <p className="font-mono text-xs text-gray-400">{cert.aiNotes}</p>
          {cert.aiConfidence != null && (
            <p className="font-mono text-xs text-gray-500 mt-1">
              Confiance : {Math.round(cert.aiConfidence * 100)}%
            </p>
          )}
        </div>
      )}

      {isPending && (
        <AdminCertVerifyActions certId={cert.id} certName={cert.name} />
      )}
    </div>
  );
}
