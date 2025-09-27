import { JwtPayload,sign,verify } from "jsonwebtoken";
import { config } from "@/config.app";
import type { StringValue } from "ms";

export enum TokenStatus {
  TOKEN_VALID = "TOKEN_VALID",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",
}

export const generateToken = (payload: object, time?: StringValue | number) => {
  const key: string = config.JWT_KEY_AUTH;
  let token = null;
  try {
    token = sign(payload, key, {
      expiresIn: time ? time : config.JWT_EXPIRES_AUTH ,
      algorithm: "HS256",
    });
  } catch (error) {
    token = null;
    console.log("Generate Token Error: ", error);
  }
  return token;
};


export const verifyToken = <T extends JwtPayload>(token: string) => {
    const key: string = config.JWT_KEY_AUTH;
    let payload: T | null = null;
  
    if (!token) {
      return {
        status: TokenStatus.TOKEN_NOT_FOUND,
        payload: null,
      };
    }
  
    try {
      payload = verify(token, key) as T;
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