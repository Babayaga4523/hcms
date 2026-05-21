/**
 * Centralized Logger Utility
 *
 * Provides structured logging for different environments:
 * - Development: Full logging with colors
 * - Production: Error-only logging
 * - API Routes: Structured error logging for observability
 */

type LogLevel = "debug" | "info" | "warn" | "error" | "audit";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
}

// Color codes for development console styling
const colors = {
  debug: "\x1b[36m",
  info: "\x1b[34m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
  audit: "\x1b[35m",
  reset: "\x1b[0m",
};

class Logger {
  private isProduction: boolean;
  private isDevelopment: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const color = colors[level];
    const formattedMessage = "[" + timestamp + "] [" + level.toUpperCase() + "] " + message;

    if (this.isProduction && level !== "error" && level !== "audit") {
      return;
    }

    if (this.isDevelopment) {
      console.log(color + formattedMessage + colors.reset);
      if (context && Object.keys(context).length > 0) {
        console.log(color + "  Context: " + JSON.stringify(context, null, 2) + colors.reset);
      }
    } else {
      const logEntry = this.formatLog(level, message, context);
      if (level === "error" || level === "audit") {
        console.error(JSON.stringify(logEntry));
      } else {
        console.log(JSON.stringify(logEntry));
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log("debug", message, context);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log("error", message, context);
  }

  audit(message: string, context?: Record<string, unknown> & { userId?: string; action?: string }): void {
    const auditContext = { ...context, type: "AUDIT" };
    this.log("audit", message, auditContext);
  }

  apiError(
    operation: string,
    error: unknown,
    requestContext?: { method?: string; path?: string; userId?: string }
  ): { message: string; code: string; details?: unknown } {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    const errorCode = this.getErrorCode(error);

    this.error(operation + " failed", {
      error: errorMessage,
      code: errorCode,
      stack: error instanceof Error ? error.stack : undefined,
      ...requestContext,
    });

    return {
      message: errorMessage,
      code: errorCode,
      details: this.isDevelopment ? error : undefined,
    };
  }

  private getErrorCode(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.includes("prisma") || error.message.includes("database")) {
        return "DB_ERROR";
      }
      if (error.message.includes("validation") || error.message.includes("invalid")) {
        return "VALIDATION_ERROR";
      }
      if (error.message.includes("not found") || error.message.includes("not exist")) {
        return "NOT_FOUND";
      }
      if (error.message.includes("unique") || error.message.includes("duplicate")) {
        return "DUPLICATE_ERROR";
      }
      if (error.message.includes("unauthorized") || error.message.includes("forbidden")) {
        return "AUTH_ERROR";
      }
    }
    return "INTERNAL_ERROR";
  }
}

export const logger = new Logger();

export type { LogLevel, LogEntry };

export const log = {
  debug: (message: string, context?: Record<string, unknown>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, unknown>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, unknown>) => logger.warn(message, context),
  error: (message: string, context?: Record<string, unknown>) => logger.error(message, context),
  audit: (message: string, context?: Record<string, unknown> & { userId?: string; action?: string }) => logger.audit(message, context),
};

export function apiErrorHandler(
  operation: string,
  error: unknown,
  context?: { method?: string; path?: string; userId?: string }
): { message: string; code: string; details?: unknown } {
  return logger.apiError(operation, error, context);
}