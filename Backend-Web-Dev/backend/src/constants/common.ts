import { config } from "@/config.app";

export const avatar_default = `https://file.minwandev.io.vn/file/avatar_default.png`;
export const avatar_default_group = `https://file.minwandev.io.vn/file/storage/group_chat_default.png`;


export enum statusAccount {
  VERIFIED = "VERIFIED",
  UNVERIFIED = "UNVERIFIED",
  BANNED = "BANNED",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
}

export enum Role {
  ROOT = "ROOT",
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
  DEV = "DEV",
}

export enum keyJWT {
  RESET_PASSWORD = "RESET_PASSWORD",
  VERIFY_EMAIL = "VERIFY_EMAIL",
  SESSION = "SESSION",
  REGISTER = "REGISTER",
}


