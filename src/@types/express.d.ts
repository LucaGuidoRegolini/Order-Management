/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };

    file?: {
      location: any;
      filename: string;
      path: any;
      isImage: boolean;
    };
  }
}
