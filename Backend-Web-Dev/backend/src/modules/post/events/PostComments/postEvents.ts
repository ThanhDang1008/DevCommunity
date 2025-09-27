import { Server, Socket, Namespace } from "socket.io";

import { authEventsMiddleware } from "@/shared/middleware/authEvents.middleware";
import { masterEventsMiddleware } from "@/shared/middleware/masterEvents.middleware";
import { Role } from "@/constants/common";
import { EnumPostEvent } from "@modules/post/constants/common";

import { logInfo } from "@/shared/utils/log";

export let socketIOPostObject: Namespace;

export class SocketIOPostHandler {
  private io: Namespace;

  constructor(io: Namespace) {
    this.io = io;
    socketIOPostObject = io;
  }

  public listen(): void {
    // this.io.use((socket: Socket, next) =>
    //   masterEventsMiddleware(
    //     socket,
    //     (err?: any) => {
    //       //console.log("authEventsMiddleware", err);
    //       // Convert string error to ExtendedError if needed, or just call next with error
    //       if (err) {
    //         // Optionally, wrap the error in an object if your middleware expects ExtendedError
    //         return next(new Error(err));
    //       }
    //       next();
    //     }
    //   )
    // );
    this.io.on("connection", (socket: Socket) => {
      socket.onAny((event, ...args) => {
        logInfo(`Socket post event received: ${event}`, args);
      }); // Log all events received by the socket
    });
  }
}
