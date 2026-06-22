import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rejectIfBanned } from "@/lib/auth-utils";
import { handleApiError, unauthorized, notFound, badRequest, success } from "@/lib/api-error";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return unauthorized();
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  const { jobId } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { candidateProfile: true },
    });

    if (!user?.candidateProfile) return notFound("Profil introuvable");

    const existing = await prisma.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: user.candidateProfile.id,
          jobId,
        },
      },
    });

    if (existing) return badRequest("Déjà postulé");

    const application = await prisma.application.create({
      data: {
        candidateId: user.candidateProfile.id,
        jobId,
        status: "PENDING",
      },
    });

    // Notifier le recruteur
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        title: true,
        recruiter: { select: { userId: true } },
      },
    });

    if (job?.recruiter?.userId) {
      await prisma.notification.create({
        data: {
          userId: job.recruiter.userId,
          title: "Nouvelle candidature",
          body: `${user.candidateProfile.firstName} ${user.candidateProfile.lastName} a postulé à « ${job.title} »`,
          type: "APPLICATION_SUBMITTED",
          link: `/recruiter/jobs/${jobId}/applications`,
        },
      });
    }

    return success({ success: true, application });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return unauthorized();
  const bannedResp = await rejectIfBanned(userId);
  if (bannedResp) return bannedResp;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        candidateProfile: {
          include: {
            applications: {
              include: { job: true },
              orderBy: { appliedAt: "desc" },
            },
          },
        },
      },
    });

    return success(user?.candidateProfile?.applications ?? []);
  } catch (error) {
    return handleApiError(error);
  }
}
