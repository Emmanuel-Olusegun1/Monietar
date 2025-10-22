// types/mono.d.ts
declare module '@mono.co/connect.js' {
  interface MonoConnectOptions {
    key: string;
    onSuccess: (data: { code: string }) => void;
    onClose: () => void;
    onLoad?: () => void;
    onEvent?: (event: string, data: any) => void;
  }

  interface MonoConnectInstance {
    setup: () => void;
    open: () => void;
    close: () => void;
  }

  class MonoConnect {
    constructor(options: MonoConnectOptions);
    setup(): void;
    open(): void;
    close(): void;
  }

  export default MonoConnect;
}