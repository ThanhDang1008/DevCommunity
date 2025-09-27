import mongoose from "mongoose";

import { logError, logInfo } from "@/shared/utils/log";
import { config } from "@/config.app";


class ConnectionToDatabase {
  constructor() {}

  public async db(): Promise<void> {
    try {
      const connection = await mongoose.connect(config.MONGO_URI);
      logInfo(
        " MongoDB Connected: " +
          `${connection.connection.name}`
      );
    } catch (error) {
      logError("setupDatabase", "Error connecting to MongoDB", error);
      return process.exit(1);
    }
  }
}

export const connectionToDatabase: ConnectionToDatabase =
  new ConnectionToDatabase();
