import { describe, it, expect } from "vitest";
import {
  AppError,
  handleApiError,
  unauthorized,
  notFound,
  badRequest,
  success,
} from "@/lib/api-error";

describe("api-error", () => {
  it("unauthorized returns 401", () => {
    const res = unauthorized();
    expect(res.status).toBe(401);
  });

  it("notFound returns 404 with message", async () => {
    const res = notFound("Profil introuvable");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Profil introuvable");
  });

  it("badRequest returns 400 with message", async () => {
    const res = badRequest("Déjà postulé");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Déjà postulé");
  });

  it("success returns 200 with data", async () => {
    const res = success({ ok: true });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("handleApiError returns 500 for unknown error", async () => {
    const res = handleApiError(new Error("Boom"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Erreur serveur");
  });

  it("handleApiError preserves AppError status", async () => {
    const err = new AppError("Interdit", 403, "FORBIDDEN");
    const res = handleApiError(err);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Interdit");
    expect(body.code).toBe("FORBIDDEN");
  });
});
