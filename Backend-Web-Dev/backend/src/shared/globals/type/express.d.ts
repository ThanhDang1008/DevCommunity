// express.d.ts
import "express";

declare module "express-serve-static-core" {
  interface Request {
    t: (...args: any[]) => string;
    tn: (...args: any[]) => string;
    __: (...args: any[]) => string;
    __n: (...args: any[]) => string;
  }
}