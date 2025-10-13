declare module "node-gtts" {
  interface GTTSSettings {
    lang?: string;
    debug?: boolean;
  }

  interface GTTSCallback {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err: Error | null, result?: any): void;
  }

  class GTTS {
    constructor(lang: string, settings?: GTTSSettings);
    save(filepath: string, text: string, callback: GTTSCallback): void;
    stream(text: string): NodeJS.ReadableStream;
    createServer(port: number, host?: string): void;
  }

  export default function gtts(lang: string, settings?: GTTSSettings): GTTS;
}
