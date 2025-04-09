declare module "tronweb" {
  interface TronWebInstance {
    defaultAddress: {
      base58: string;
      hex: string;
    };
    transactionBuilder: {
      sendToken: (
        to: string,
        amount: number,
        tokenId: string,
        from: string
      ) => Promise<any>;
    };
    trx: {
      sign: (tx: any) => Promise<any>;
      sendRawTransaction: (signedTx: any) => Promise<any>;
    };
  }

  interface TronWebConstructor {
    new (options: { fullHost: string }): TronWebInstance;
  }

  const TronWeb: TronWebConstructor & TronWebInstance;
  export default TronWeb;
}