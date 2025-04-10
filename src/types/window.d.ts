declare global {
    interface Window {
      ethereum?: any;
      tronWeb?: {
        defaultAddress: { base58: string };
        trx: {
          getBalance: (address?: string) => Promise<number>;
          sendRawTransaction: (transaction: any) => Promise<any>;
          [key: string]: any; // Allows any additional methods on trx
        };
        fromSun: (sun: number) => string;
        ready?: boolean;
        [key: string]: any;
      };
      tronLink?: {
        request: (args: { method: string }) => Promise<any>;
      };
    }
  }
  
  // This empty export turns the file into a module
  export {};