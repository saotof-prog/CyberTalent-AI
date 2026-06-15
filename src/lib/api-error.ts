import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  const err = error as { status?: number; errorDetails?: { "@type"?: string }[] };

  if (
    err?.status === 429 ||
    err?.errorDetails?.[0]?.["@type"] === "type.googleapis.com/google.rpc.QuotaFailure"
  ) {
    console.warn("Gemini API quota exceeded");
    return NextResponse.json(
      {
        error: "Service d'analyse temporairement indisponible en raison de limites d'utilisation.",
        code: "QUOTA_EXCEEDED",
      },
      { status: 429 }
    );
  }

  if (err?.status === 401) {
    return NextResponse.json({ error: "Non autorisé", code: "UNAUTHORIZED" }, { status: 401 });
  }

  if (err?.status === 404) {
    return NextResponse.json(
      { error: "Ressource introuvable", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  console.error("UNHANDLED ERROR:", error);
  return NextResponse.json({ error: "Erreur serveur", code: "INTERNAL_ERROR" }, { status: 500 });
}

export function unauthorized() {
  return NextResponse.json({ error: "Non autorisé", code: "UNAUTHORIZED" }, { status: 401 });
}

export function notFound(message = "Ressource introuvable") {
  return NextResponse.json({ error: message, code: "NOT_FOUND" }, { status: 404 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message, code: "BAD_REQUEST" }, { status: 400 });
}

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
