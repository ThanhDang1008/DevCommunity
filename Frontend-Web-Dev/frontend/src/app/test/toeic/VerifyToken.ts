import { verify, TokenExpiredError, JsonWebTokenError, JwtPayload } from "jsonwebtoken";

export enum TokenStatus {
  TOKEN_VALID = "TOKEN_VALID",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",
}

export enum EnumTokenPayloadKey {
  TOEIC = "TOEIC",
}

export type TokenResult<T extends JwtPayload> = {
  status: TokenStatus;
  payload: T | null;
};

function isJwtPayload(payload: unknown): payload is JwtPayload {
  return typeof payload === "object" && payload !== null && "exp" in payload;
}

export async function verifyToken<T extends JwtPayload>(token: string): Promise<TokenResult<T>> {
  const KEY_MASTER = process.env.KEY_MASTER || "key_master";
  //console.log("KEY_MASTER", KEY_MASTER);
  //console.log("Token to verify:", token);

  if (!token) {
    return {
      status: TokenStatus.TOKEN_NOT_FOUND,
      payload: null,
    };
  }

  //console.log("Verifying token:", token);

  try {
    const decoded = verify(token.trim(), KEY_MASTER, { algorithms: ["HS256"] });

    //console.log("Decoded token:", decoded);

    if (!isJwtPayload(decoded)) {
      return {
        status: TokenStatus.TOKEN_INVALID,
        payload: null,
      };
    }

    return {
      status: TokenStatus.TOKEN_VALID,
      payload: decoded as T,
    };
  } catch (error: any) {
    //console.error("Verify token error:", error);
    if (error instanceof TokenExpiredError) {
      return {
        status: TokenStatus.TOKEN_EXPIRED,
        payload: null,
      };
    } else if (error instanceof JsonWebTokenError) {
      return {
        status: TokenStatus.TOKEN_INVALID,
        payload: null,
      };
    }

    return {
      status: TokenStatus.TOKEN_INVALID,
      payload: null,
    };
  }
}
