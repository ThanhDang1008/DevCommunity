// import { useEffect, useRef, useState, useCallback } from "react";
// import { io, Socket } from "socket.io-client";

// import { getTokenAuth2 } from "@/components/auth/TokenAuth2";
// import { eventSocket } from "@/constants/Common";

// interface UseSocketOptions {
//   url?: string;
//   options?: any;
//   autoConnect?: boolean;
// }

// interface UseSocketReturn {
//   socket: Socket | null;
//   isConnected: boolean;
//   error: string | null;
//   connect: () => void;
//   disconnect: () => void;
//   emit: (event: string, data?: any) => void;
//   on: (event: string, callback: (data: any) => void) => void;
//   off: (event: string, callback?: (data: any) => void) => void;
// }

// const useSocket = ({
//   url = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001",
//   options = {},
//   autoConnect = true,
// }: UseSocketOptions = {}): UseSocketReturn => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const socketRef = useRef<Socket | null>(null);

//   const connect = useCallback(() => {
//     if (socketRef.current?.connected) return;

//     try {
//       const token = getTokenAuth2();
//       console.log("Connecting to socket with token:", token);

//       socketRef.current = io(url, {
//         transports: ["websocket", "polling"], // Chọn giao thức phù hợp
//         autoConnect: autoConnect,
//         auth: {
//           token: token ? `Bearer ${token}` : undefined,
//         },
//         withCredentials: true, // Gửi cookie với yêu cầu
//         ...options,
//       });

//       // Event listeners cho connection
//       socketRef.current.on(eventSocket.CONNECT, () => {
//         setIsConnected(true);
//         setError(null);
//         {
//           process.env.NODE_ENV === "development" &&
//             console.log("Socket connected:", socketRef.current?.id);
//         }
//       });

//       socketRef.current.on(eventSocket.DISCONNECT, (reason) => {
//         setIsConnected(false);
//         {
//           process.env.NODE_ENV === "development" &&
//             console.log("Socket disconnected:", reason);
//         }
//       });

//       socketRef.current.on(eventSocket.CONNECT_ERROR, (err) => {
//         setError(err.message);
//         setIsConnected(false);
//         {
//           process.env.NODE_ENV === "development" &&
//             console.error("Socket connection error:", err);
//         }
//       });

//       socketRef.current.connect();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Connection failed");
//     }
//   }, [url, options]);

//   const disconnect = useCallback(() => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//       setIsConnected(false);
//     }
//   }, []);

//   const emit = useCallback((event: string, data?: any) => {
//     if (socketRef.current?.connected) {
//       socketRef.current.emit(event, data);
//     } else {
//       {
//         process.env.NODE_ENV === "development" &&
//           console.log("Socket is not connected. Cannot emit event:", event);
//       }
//     }
//   }, []);

//   const on = useCallback((event: string, callback: (data: any) => void) => {
//     if (socketRef.current) {
//       socketRef.current.on(event, callback);
//     }
//   }, []);

//   const off = useCallback((event: string, callback?: (data: any) => void) => {
//     if (socketRef.current) {
//       if (callback) {
//         socketRef.current.off(event, callback);
//       } else {
//         socketRef.current.off(event);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (autoConnect) {
//       connect();
//     }

//     return () => {
//       disconnect();
//     };
//   }, [connect, disconnect, autoConnect]);

//   return {
//     socket: socketRef.current,
//     isConnected,
//     error,
//     connect,
//     disconnect,
//     emit,
//     on,
//     off,
//   };
// };

// export default useSocket;

// hooks/useSocket.ts
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001"; // Thay đổi URL nếu cần

const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Chỉ tạo socket khi chưa tồn tại
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket", "polling"], // Chọn giao thức phù hợp
      });

      socketRef.current.on("connect", () => {
        setIsConnected(true);
        console.log("Socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
};

export {useSocket}