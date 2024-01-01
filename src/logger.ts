import pino, { Logger as Pino } from "pino";

export class Logger {
  private readonly pino: Pino;
  constructor(opts: { logLevel: "debug" | "info" | "warn" | "error" }) {
    this.pino = pino({
      level: opts.logLevel,
    });
  }

  trace(msg: string, extra?: Record<string, unknown>) {
    this.pino.trace({ msg, ...extra });
  }
  debug(msg: string, extra?: Record<string, unknown>) {
    this.pino.debug({ msg, ...extra });
  }
  info(msg: string, extra?: Record<string, unknown>) {
    this.pino.info({ msg, ...extra });
  }
  warn(msg: string, extra?: Record<string, unknown>) {
    this.pino.warn({ msg, ...extra });
  }
  error(msg: string, extra?: Record<string, unknown>) {
    this.pino.error({ msg, ...extra });
  }
  fatal(msg: string, extra?: Record<string, unknown>) {
    this.pino.fatal({ msg, ...extra });
  }
}
