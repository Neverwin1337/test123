import { logSecurityEvent } from "../utils/logger.js";

const suspiciousPatterns = [
  /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/i,
  /(\bor\b|\band\b)\s+'?\w+'?\s*=\s*'?\w+'?/i,
  /union\s+select/i,
  /;\s*(drop|delete|insert|update|alter)\b/i,
  /--/,
  /#/,
  /\/\*/,
  /sleep\s*\(\s*\d+/i,
  /exec\b/i,
];

const isSuspiciousValue = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  return suspiciousPatterns.some((pattern) => pattern.test(value));
};

const inspectPayload = (payload, path = [], findings = []) => {
  if (payload === null || payload === undefined) {
    return findings;
  }

  if (typeof payload === "object") {
    Object.entries(payload).forEach(([key, value]) => {
      inspectPayload(value, path.concat(key), findings);
    });
    return findings;
  }

  if (isSuspiciousValue(payload)) {
    findings.push({ field: path.join("."), value: payload });
  }

  return findings;
};

export const detectSQLInjection = (req, res, next) => {
  try {
    const suspiciousFields = [];
    inspectPayload(req.body, ["body"], suspiciousFields);
    inspectPayload(req.params, ["params"], suspiciousFields);
    inspectPayload(req.query, ["query"], suspiciousFields);

    if (suspiciousFields.length > 0) {
      logSecurityEvent("SQL_INJECTION_ATTEMPT", req, { suspiciousFields });
      return res.status(400).json({
        success: false,
        message: "Suspicious input detected and blocked.",
      });
    }

    return next();
  } catch (error) {
    logSecurityEvent("SQL_VALIDATION_ERROR", req, { message: error.message });
    return res.status(500).json({ success: false, message: "Security middleware error" });
  }
};
