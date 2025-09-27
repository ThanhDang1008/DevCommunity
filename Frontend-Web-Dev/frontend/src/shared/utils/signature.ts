"use server";

import { sign } from "jsonwebtoken";
import type { StringValue } from "ms";

export const generateSignature = async (
  payload?: object,
  time?: StringValue | number
) => {
  const secret: string = process.env.KEY_MASTER || "key_master";
  //console.log("Secret: ", secret);
  let token = null;
  try {
    token = sign(
      {
        ...payload,
        signature: true,
      },
      secret,
      {
        expiresIn: time ? time : "30s",
        algorithm: "HS256",
      }
    );
  } catch (error) {
    console.log("Generate signature error: ", error);
    token = null;
  }
  return token;
};
