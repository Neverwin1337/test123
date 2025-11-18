import fs from "fs";
import path from "path";

const LOG_DIR = path.resolve(process.cwd(), "logs");
const SECURITY_LOG = path.join(LOG_DIR, "security.log");
const AUDIT_LOG = path.join(LOG_DIR, "audit.log");

const ensureLogDir = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
};

const buildBaseMetadata = (req = {}) => ({
  path: req?.originalUrl,
  method: req?.method,
  ip: req?.ip,
  userId: req?.user?.id ?? null,
  userType: req?.user?.type ?? "anonymous",
});

const appendLog = (filePath, payload) => {
  try {
    ensureLogDir();
    const entry = `${JSON.stringify(payload)}\n`;
    fs.appendFile(filePath, entry, (err) => {
      if (err) {
        console.error(`[logger] Failed to write to ${filePath}:`, err.message);
      }
    });
  } catch (error) {
    console.error("[logger] Unexpected error while logging", error.message);
  }
};

export const logSecurityEvent = (eventType, req, details = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    category: "security",
    eventType,
    ...buildBaseMetadata(req),
    details,
  };
  appendLog(SECURITY_LOG, payload);
};

export const logDataModification = (action, entity, req, details = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    category: "data_change",
    action,
    entity,
    ...buildBaseMetadata(req),
    details,
  };
  appendLog(AUDIT_LOG, payload);
};
