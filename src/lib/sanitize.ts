const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b/gi,
  /<object\b/gi,
  /<embed\b/gi,
  /<svg\b/gi,
  /<math\b/gi,
  /<link\b/gi,
  /<style\b/gi,
  /expression\s*\(/gi,
  /vbscript:/gi,
  /data:\s*text\/html/gi,
  /document\.cookie/gi,
  /document\.write/gi,
  /eval\s*\(/gi,
  /new\s+Function/gi,
  /setTimeout\s*\(/gi,
  /setInterval\s*\(/gi,
];

export function sanitizeText(input: string): string {
  let result = input.replace(/[<>]/g, "");

  for (const pattern of XSS_PATTERNS) {
    result = result.replace(pattern, "");
  }

  return result.trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeText(value);
    } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function validateFileType(filename: string, allowedExtensions: string[]): boolean {
  const ext = filename.toLowerCase().split(".").pop();
  return ext ? allowedExtensions.includes(`.${ext}`) : false;
}

export function validateMimeType(mime: string, allowedMimes: string[]): boolean {
  return allowedMimes.includes(mime);
}

export function isSqlInjection(input: string): boolean {
  const SQL_PATTERNS = [
    /(\bSELECT\b.*\bFROM\b)/gi,
    /(\bDROP\b\s+\bTABLE\b)/gi,
    /(\bDELETE\b\s+\bFROM\b)/gi,
    /(\bINSERT\b\s+\bINTO\b)/gi,
    /(\bUPDATE\b\s+\w+\s+\bSET\b)/gi,
    /(\bUNION\b\s+\bSELECT\b)/gi,
    /(\bALTER\b\s+\bTABLE\b)/gi,
    /(\bCREATE\b\s+\bTABLE\b)/gi,
    /(\bEXEC\b|\bEXECUTE\b)/gi,
    /(\bXP_CMDSHELL\b)/gi,
    /('?\s*OR\s+1\s*=\s*1)/gi,
    /('?\s*OR\s+'1'\s*=\s*'1)/gi,
    /(--\s*$)/gm,
    /(\/\*[\s\S]*?\*\/)/g,
  ];
  return SQL_PATTERNS.some((pattern) => pattern.test(input));
}
