import { io, Socket } from "socket.io-client";
import { baseURL } from "@/lib/axiosInstance";

import { KEY_MASTER } from "@/constants/Common";

class SocketPostService {
  private socket: Socket;

  constructor() {
    this.socket = io(`${baseURL}/socket/v1/post`, {
      withCredentials: true,
      transports: ["websocket", "polling"], // Chọn giao thức phù hợp
      reconnection: true, // ✅ tự động reconnect
      reconnectionAttempts: 5, // cố gắng reconnect 5 lần
      reconnectionDelay: 1000, // mỗi lần cách nhau 1s
      reconnectionDelayMax: 5000, // tối đa delay là 5s
      timeout: 20000, // timeout cho kết nối
      auth: {
        token: "",
      },
      autoConnect: false, // để không tự động kết nối ngay khi khởi tạo
    });
  }

  public getSocket() {
    return this.socket;
  }

  public connect() {
    //console.log("key master", KEY_MASTER);
    this.socket.auth = { token: KEY_MASTER };
    //console.log("Connecting to socket with token:", tokenAuth2);
    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  public on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  public off(event: string, callback?: (data: any) => void) {
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  public once(event: string, callback: (data: any) => void) {
    this.socket.once(event, callback);
  }

  public removeAllListeners(event?: string) {
    if (event) {
      this.socket.removeAllListeners(event);
    } else {
      this.socket.removeAllListeners();
    }
  }

  socketConnectionEvents() {
    this.socket.on("connect", () => {
      {
        process.env.NODE_ENV === "development" &&
          console.log(">>>(dev) ✅ socket post connected");
      }
    });

    this.socket.on("disconnect", (reason) => {
      {
        process.env.NODE_ENV === "development" &&
          console.log(`>>>(dev) ❌ socket post disconnected: ${reason}`);
      }
    });

    this.socket.on("connect_error", (error) => {
      {
        process.env.NODE_ENV === "development" &&
          console.log(">>>(dev)❌ socket post connection error:", error);
      }
    });
  }
}

export const socketPostService = new SocketPostService();
