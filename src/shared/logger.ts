export default class Logger {
  public static readonly TRACE = "trace";
  public static readonly DEBUG = "debug";
  public static readonly INFO = "info";
  public static readonly LOG = "log";
  public static readonly WARN = "warn";
  public static readonly ERROR = "error";
  private static off: boolean;
  private static levels: string[] = [
    "trace",
    "debug",
    "log",
    "info",
    "warn",
    "error",
  ];
  private static only: string[] = [];
  private static readonly colors: { [K: string]: string } = {
    trace: "BEBEBE",
    debug: "007ACC",
    log: "00CC00",
    info: "00CC00",
    warn: "FFCC00",
    error: "FF0000",
  };
  private static lines: any[] = [];
  private static currentLine: number = 0;

  static #clear() {
    console.clear();
    Logger.currentLine = 0;
  }

  static #writeLog(level: string, id: string, msg: any) {
    if (Logger.off || !Logger.levels.includes(level)) return;
    if (Logger.only.length && !Logger.only.includes(id)) return;
    console.log(
      `%c[${level}] %c${id}-> %c${msg}`,
      `color: #${Logger.colors[level]}`,
      "color: #000; font-weight: bold;",
      `color: #${Logger.colors[level]}; font-style: italic;`
    );
  }

  static objectLog(level: string, id: string, obj: object) {
    if (Logger.off || !Logger.levels.includes(level)) return;
    if (Logger.only.length && !Logger.only.includes(id)) return;
    console.log(`%c[${level.toUpperCase()}] ${id}->`, "font-weight: bold;");
    console.dir(obj);
  }

  static dispatch(level: string, id: string, msg: any) {
    if (typeof msg !== "string") return Logger.objectLog(level, id, msg);
    Logger.#writeLog(level, id, msg);
  }

  static oneline(level: string, id: string, msg: any, append: boolean = true) {
    if (!append) Logger.currentLine++;
    if (append && Logger.lines[Logger.currentLine]) {
      Logger.lines[Logger.currentLine].push({ level, id, msg });
    } else {
      Logger.lines[Logger.currentLine] = [];
      Logger.lines[Logger.currentLine].push({ level, id, msg });
    }
    Logger.#clear();
    Logger.lines.forEach((l) => {
      const line = l.pop();
      Logger.dispatch(line.level, line.id, line.msg);
    });
  }

  static trace(id: string, msg: string | object) {
    const level = Logger.TRACE;
    Logger.dispatch(level, id, msg);
  }

  static debug(id: string, msg: string | object) {
    const level = Logger.DEBUG;
    Logger.dispatch(level, id, msg);
  }

  static log(id: string, msg: string | object) {
    const level = Logger.LOG;
    Logger.dispatch(level, id, msg);
  }

  static info(id: string, msg: string | object) {
    const level = Logger.INFO;
    Logger.dispatch(level, id, msg);
  }

  static warn(id: string, msg: string | object) {
    const level = Logger.WARN;
    Logger.dispatch(level, id, msg);
    console.warn(msg);
  }

  static error(id: string, msg: string | object, error: Error) {
    const level = Logger.ERROR;
    Logger.dispatch(level, id, msg);
    console.error(error);
  }

  static setOff() {
    Logger.off = true;
  }

  static setLevels(levels: string[]) {
    Logger.levels = levels;
  }

  static setOnly(only: string[]) {
    Logger.only = only;
  }
}
