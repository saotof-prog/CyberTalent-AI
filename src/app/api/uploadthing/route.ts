import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
    logLevel: "Debug",
  },
});

export async function GET(req: Request) {
  console.log("UploadThing GET appelé");
  return handlers.GET(req);
}

export async function POST(req: Request) {
  console.log("==== UPLOADTHING POST ====");

  try {
    const res = await handlers.POST(req);

    console.log("STATUS:", res.status);

    const cloned = res.clone();

    try {
      console.log("BODY:", await cloned.text());
    } catch {}

    return res;
  } catch (e) {
    console.error("UPLOADTHING FULL ERROR:", e);
    throw e;
  }
}