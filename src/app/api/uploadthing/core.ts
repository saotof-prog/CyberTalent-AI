import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  certificationUploader: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      try {
        const { userId } = await auth();
        console.log("UploadThing middleware - userId:", userId);
        if (!userId) throw new Error("Non autorisé");
        return { userId };
      } catch (e) {
        console.error("UploadThing middleware error:", e);
        throw e;
      }
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload terminé:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
