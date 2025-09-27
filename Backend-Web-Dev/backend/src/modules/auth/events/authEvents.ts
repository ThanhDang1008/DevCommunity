import { Server, Socket, Namespace } from "socket.io";

import { authEventsMiddleware } from "@/shared/middleware/authEvents.middleware";
import { Role } from "@/constants/common";

export let socketIOAuthObject: Namespace;

type SessionDestroy = {
  session_id: string;
};

export class SocketIOAuthHandler {
  private io: Namespace;

  constructor(io: Namespace) {
    this.io = io;
    socketIOAuthObject = io;
  }

  public listen(): void {
    // this.io.use((socket: Socket, next) =>
    //   authEventsMiddleware(
    //     socket,
    //     [Role.ROOT, Role.ADMIN, Role.USER],
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
      socket.on("session_destroy", async (data: SessionDestroy) => {
        console.log("data", data);
      });
    });
  }
}
