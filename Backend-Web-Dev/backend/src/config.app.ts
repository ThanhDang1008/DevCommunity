import type { StringValue } from "ms";

const SERVER_PORT = 5000;
const SERVER_HOST = "localhost";

class Config {
  public NODE_ENV: "production" | "development" | "test";
  public PORT: string;
  public HOST: string;

  public CLIENT_URL: string | undefined;
  public CLIENT_URL2: string | undefined;
  public CLIENT_URL3: string | undefined;
  public CLIENT_URL4: string | undefined;

  public MONGO_URI: string;

  public EMAIL_USER: string | undefined;
  public EMAIL_PASS: string | undefined;

  public JWT_KEY_AUTH: string;
  public JWT_EXPIRES_AUTH: StringValue;

  public COOKIE_NAME_AUTH: string;
  public COOKIE_EXPIRES_IN: string | number;

  public KEY_MASTER: string;

  public CLOUDFLARE_R2_ENDPOINT: string;
  public CLOUDFLARE_R2_ACCESS_KEY_ID: string;
  public CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;
  public CLOUDFLARE_R2_BUCKET_NAME: string;
  public CLOUDFLARE_R2_DOMAIN: string;

  public MAX_FILE_IMAGE_SIZE: number;
  public MAX_FILE_VIDEO_SIZE: number;
  public MAX_FILE_SIZE: number;

  public PATH_STORAGE_IMAGE: string;
  public PATH_STORAGE_VIDEO: string;
  public PATH_STORAGE_FILE: string;
  public PATH_STORAGE_TRASH: string;

  constructor() {
    this.NODE_ENV =
      (process.env.NODE_ENV as "production" | "development" | "test") ||
      "development";
    this.PORT = process.env.PORT || SERVER_PORT.toString();
    this.HOST = process.env.HOST || SERVER_HOST;

    this.CLIENT_URL = process.env.CLIENT_URL;
    this.CLIENT_URL2 = process.env.CLIENT_URL2;
    this.CLIENT_URL3 = process.env.CLIENT_URL3;
    this.CLIENT_URL4 = process.env.CLIENT_URL4;

    this.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

    this.EMAIL_USER = process.env.EMAIL_USER;
    this.EMAIL_PASS = process.env.EMAIL_PASS;

    this.JWT_KEY_AUTH = process.env.JWT_KEY_AUTH || "KEY_DEFAULT";
    this.JWT_EXPIRES_AUTH =
      (process.env.JWT_EXPIRES_AUTH as StringValue) || "1d";

    this.COOKIE_NAME_AUTH = process.env.COOKIE_NAME_AUTH || "session";
    this.COOKIE_EXPIRES_IN = process.env.COOKIE_EXPIRES_IN || 86400000; // 1 day (miliseconds)

    this.KEY_MASTER = process.env.KEY_MASTER || "KEY_MASTER";

    this.CLOUDFLARE_R2_ENDPOINT =
      process.env.CLOUDFLARE_R2_ENDPOINT ||
      "https://123456.r2.cloudflarestorage.com";
    this.CLOUDFLARE_R2_ACCESS_KEY_ID =
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "KEY_ID";
    this.CLOUDFLARE_R2_SECRET_ACCESS_KEY =
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "KEY_SECRET";
    this.CLOUDFLARE_R2_BUCKET_NAME =
      process.env.CLOUDFLARE_R2_BUCKET_NAME || "file";
    this.CLOUDFLARE_R2_DOMAIN =
      process.env.CLOUDFLARE_R2_DOMAIN || "https://file.minwandev.io.vn";

    this.MAX_FILE_IMAGE_SIZE = 1024 * 1024 * 10; // 10MB
    this.MAX_FILE_VIDEO_SIZE = 1024 * 1024 * 100; // 100MB
    this.MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB

    this.PATH_STORAGE_IMAGE = "./upload/image/";
    this.PATH_STORAGE_VIDEO = "./upload/video/";
    this.PATH_STORAGE_FILE = "./upload/file/";
    this.PATH_STORAGE_TRASH = "./upload/trash/";
  }
}

export const config: Config = new Config();
