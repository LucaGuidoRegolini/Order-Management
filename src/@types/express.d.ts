/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  export interface Request {
    user: {
      id: string;
      isMaster: boolean;
    };

    file?: {
      location: any;
      filename: string;
      path: any;
      isImage: boolean;
    };
  }
}
