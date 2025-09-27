import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "@/config.app";

export enum TokenStatus {
  TOKEN_VALID = "TOKEN_VALID",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",
}

export const verifySignature = <T extends JwtPayload>(token: string) => {
  const secret: string = config.KEY_MASTER;
  let payload: T | null = null;

  if (!token) {
    return {
      status: TokenStatus.TOKEN_NOT_FOUND,
      payload: null,
    };
  }

  try {
    payload = verify(token, secret) as T;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      //check refresh token
      //console.log("token expired");
      return {
        status: TokenStatus.TOKEN_EXPIRED,
        payload: payload,
      };
    } else {
      //console.log("check error name", error.name);
      return {
        status: TokenStatus.TOKEN_INVALID,
        payload: null,
      };
    }
  }
  return {
    status: TokenStatus.TOKEN_VALID,
    payload: payload,
  };
};
