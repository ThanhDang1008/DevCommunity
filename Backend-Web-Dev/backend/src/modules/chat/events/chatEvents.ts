import { Server, Socket, Namespace } from "socket.io";

import { authEventsMiddleware } from "@/shared/middleware/authEvents.middleware";
import { Role } from "@/constants/common";
import { ChatEvent } from "@modules/chat/constants/common";

import { logInfo } from "@/shared/utils/log";

// Định nghĩa các sự kiện Video Call
enum VideoCallEvent {
  JOIN_VIDEO_ROOM = "join-video-room",
  LEAVE_VIDEO_ROOM = "leave-video-room",
  USER_JOINED_VIDEO_ROOM = "user-joined-video-room", // Khi có người mới vào phòng
  USER_LEFT_VIDEO_ROOM = "user-left-video-room", // Khi có người rời phòng
  CURRENT_VIDEO_ROOM_PARTICIPANTS = "current-video-room-participants", // Gửi danh sách người trong phòng
  WEBRTC_OFFER = "webrtc-offer",
  WEBRTC_ANSWER = "webrtc-answer",
  WEBRTC_ICE_CANDIDATE = "webrtc-ice-candidate",
}

// Giả định UserInfo (bạn nên lấy từ authenticated token hoặc database)
interface UserInfo {
  userId: string;
  userName: string;
  socketId: string;
  roomId?: string; // Room ID nếu người dùng đang trong cuộc gọi video
}

// Sử dụng Map để lưu trữ users để dễ dàng tìm kiếm theo socket.id
const connectedUsers = new Map<string, UserInfo>();
// Sử dụng Map để lưu trữ các phòng và danh sách socket IDs trong phòng đó
const videoRooms = new Map<string, string[]>(); // Map<roomId, List<socketId>>

export const onlineUsers = new Map<string, string>();
//console.log("onlineUsers initialized", onlineUsers);

export let socketIOChatObject: Namespace;

export class SocketIOChatHandler {
  private io: Namespace;

  constructor(io: Namespace) {
    this.io = io;
    socketIOChatObject = io;
  }

  public listen(): void {
    this.io.use((socket: Socket, next) =>
      authEventsMiddleware(
        socket,
        Object.values(Role), // Use Object.values to get all roles dynamically
        (err?: any) => {
          //console.log("authEventsMiddleware", err);
          // Convert string error to ExtendedError if needed, or just call next with error
          if (err) {
            // Optionally, wrap the error in an object if your middleware expects ExtendedError
            return next(new Error(err));
          }
          next();
        }
      )
    );
    this.io.on("connection", (socket: Socket) => {
      socket.onAny((event, ...args) => {
        logInfo(`Socket chat event received: ${event}`, args);
      }); // Log all events received by the socket

      socket.on(
        ChatEvent.CHAT_GROUP_TYPING,
        async (data: {
          groupId: string;
          userId: string;
          fullname: string;
          isTyping: boolean;
        }) => {
          // console.log("data", data);
          // Handle group typing event
          // You can emit this event to all participants in the group
          const event = `${ChatEvent.CHAT_GROUP_TYPING}_${data.groupId}`;
          socket.to(data?.groupId).emit(event, data);
        }
      );

      socket.on(ChatEvent.JOIN_GROUP_CHAT, async (data: any) => {
        //console.log("👋 User joined group chat:", data);
        // Handle user joining group chat
        // You can emit this event to all participants in the group
        socket.join(data?.groupId); //Socket.IO lưu thông tin này trong RAM
        socket.to(data?.groupId).emit(ChatEvent.JOIN_GROUP_CHAT, data);
      });

      socket.on(ChatEvent.LEAVE_GROUP_CHAT, async (data: any) => {
        console.log("🏃🚪 User leave group chat:", data);
        // Handle user leaving group chat
        // You can emit this event to all participants in the group
        socket.leave(data?.groupId); //Socket.IO xóa thông tin này trong RAM
        socket.to(data?.groupId).emit(ChatEvent.LEAVE_GROUP_CHAT, data);
      });

      socket.on(
        ChatEvent.CHAT_GROUP_JOIN_MULTIPLE,
        (data: { listGroupId: string[]; userId: string }) => {
          data.listGroupId.forEach((groupId) => {
            logInfo(`👋 User ${data.userId} joined group ${groupId}`);
            // Handle user joining group chat
            socket.join(groupId);
          });
        }
      );

      socket.on(
        ChatEvent.CHAT_GROUP_LEAVE_MULTIPLE,
        (data: { listGroupId: string[]; userId: string }) => {
          data.listGroupId.forEach((groupId) => {
            //console.log(`🏃🚪 User ${data.userId} leave group ${groupId}`);
            logInfo(`🏃🚪 User ${data.userId} left group ${groupId}`);
            socket.leave(groupId);
          });
        }
      );

      socket.on(
        ChatEvent.CHAT_GROUP_ONLINE_COUNT,
        (data: { groupId: string }) => {
          // Handle online count for group chat
          const onlineCount =
            this.io.adapter.rooms.get(data.groupId)?.size || 0;
          logInfo(`Online count for group ${data.groupId}: ${onlineCount}`);
          // Uncomment the line below
          //console.log(`Online count for group ${data.groupId}: ${onlineCount}`);

          const event = `${ChatEvent.CHAT_GROUP_ONLINE_COUNT}_${data.groupId}`;
          //to(data.groupId) để gửi đến tất cả người dùng trong nhóm trừ người gửi
          socket.emit(event, {
            groupId: data.groupId,
            onlineCount: onlineCount,
          });
        }
      );

      socket.on("user_online", (userId: string) => {
        onlineUsers.set(userId, socket.id);
        logInfo(`User ${userId} is online with socket ID: ${socket.id}`);
      });

      socket.on("user_offline", (userId: string) => {
        onlineUsers.delete(userId);
        logInfo(`User ${userId} is offline`);
      });

      //viết tiếp ở đây

      // --- Video Call Events ---
      // socket.on(
      //   VideoCallEvent.JOIN_VIDEO_ROOM,
      //   ({ roomId }: { roomId: string }) => {
      //     const user = connectedUsers.get(socket.id);
      //     if (!user) {
      //       logInfo(`User not found for socket ${socket.id}`);
      //       return;
      //     }

      //     socket.join(roomId); // Thêm socket vào phòng Socket.IO
      //     user.roomId = roomId; // Cập nhật thông tin phòng cho user

      //     if (!videoRooms.has(roomId)) {
      //       videoRooms.set(roomId, []);
      //     }
      //     // Thêm socket ID vào danh sách người tham gia phòng video
      //     const participants = videoRooms.get(roomId)!;
      //     if (!participants.includes(socket.id)) {
      //       participants.push(socket.id);
      //     }

      //     logInfo(
      //       `${user.userName} (${user.userId}) joined video room ${roomId}. Current participants: ${participants.length}`
      //     );

      //     // 1. Gửi danh sách các user hiện có trong phòng cho user mới join
      //     const participantsInRoom = participants
      //       .filter((id) => id !== socket.id) // Không bao gồm chính mình
      //       .map((id) => {
      //         const participantUser = connectedUsers.get(id);
      //         return participantUser
      //           ? {
      //               socketId: participantUser.socketId,
      //               userId: participantUser.userId,
      //               userName: participantUser.userName,
      //             }
      //           : null;
      //       })
      //       .filter(Boolean); // Lọc bỏ các null/undefined

      //     socket.emit(
      //       VideoCallEvent.CURRENT_VIDEO_ROOM_PARTICIPANTS,
      //       participantsInRoom
      //     );
      //     logInfo(
      //       `Sent current participants to ${user.userName}: ${JSON.stringify(
      //         participantsInRoom.map((p) => p?.userName)
      //       )}`
      //     );

      //     // 2. Gửi sự kiện 'user-joined-video-room' tới tất cả người trong phòng (trừ người vừa join)
      //     // Để họ biết người mới đã join và tạo RTCPeerConnection với người mới
      //     socket.to(roomId).emit(VideoCallEvent.USER_JOINED_VIDEO_ROOM, {
      //       peerId: socket.id, // Socket ID của người vừa join
      //       userId: user.userId,
      //       userName: user.userName,
      //     });
      //     logInfo(
      //       `Notified others in room ${roomId} about ${user.userName} joining.`
      //     );
      //   }
      // );

      // socket.on(
      //   VideoCallEvent.LEAVE_VIDEO_ROOM,
      //   ({ roomId }: { roomId: string }) => {
      //     const user = connectedUsers.get(socket.id);
      //     if (!user) return;

      //     socket.leave(roomId); // Rời phòng Socket.IO
      //     delete user.roomId; // Xóa thông tin phòng

      //     if (videoRooms.has(roomId)) {
      //       const participants = videoRooms.get(roomId)!;
      //       videoRooms.set(
      //         roomId,
      //         participants.filter((id) => id !== socket.id)
      //       ); // Xóa khỏi danh sách người tham gia
      //       if (videoRooms.get(roomId)?.length === 0) {
      //         videoRooms.delete(roomId); // Nếu không còn ai, xóa phòng
      //       }
      //     }

      //     logInfo(
      //       `${user.userName} (${user.userId}) left video room ${roomId}`
      //     );
      //     // Thông báo cho những người còn lại rằng một người đã rời đi
      //     socket.to(roomId).emit(VideoCallEvent.USER_LEFT_VIDEO_ROOM, {
      //       peerId: socket.id,
      //       userId: user.userId,
      //     });
      //   }
      // );

      // WebRTC Signaling Events
      // socket.on(
      //   VideoCallEvent.WEBRTC_OFFER,
      //   ({
      //     targetSocketId,
      //     sdp,
      //     senderUserId,
      //     senderUserName,
      //   }: {
      //     targetSocketId: string;
      //     sdp: RTCSessionDescriptionInit;
      //     senderUserId: string;
      //     senderUserName: string;
      //   }) => {
      //     logInfo(
      //       `WEBRTC: Offer from ${senderUserName} (${senderUserId}) to ${targetSocketId}`
      //     );
      //     this.io.to(targetSocketId).emit(VideoCallEvent.WEBRTC_OFFER, {
      //       sdp,
      //       senderSocketId: socket.id, // ID socket của người gửi offer
      //       senderUserId,
      //       senderUserName,
      //     });
      //   }
      // );

      // socket.on(
      //   VideoCallEvent.WEBRTC_ANSWER,
      //   ({
      //     targetSocketId,
      //     sdp,
      //     senderUserId,
      //   }: {
      //     targetSocketId: string;
      //     sdp: RTCSessionDescriptionInit;
      //     senderUserId: string;
      //   }) => {
      //     logInfo(`WEBRTC: Answer from ${senderUserId} to ${targetSocketId}`);
      //     this.io.to(targetSocketId).emit(VideoCallEvent.WEBRTC_ANSWER, {
      //       sdp,
      //       senderSocketId: socket.id, // ID socket của người gửi answer
      //       senderUserId,
      //     });
      //   }
      // );

      // socket.on(
      //   VideoCallEvent.WEBRTC_ICE_CANDIDATE,
      //   ({
      //     targetSocketId,
      //     candidate,
      //     senderUserId,
      //   }: {
      //     targetSocketId: string;
      //     candidate: RTCIceCandidateInit;
      //     senderUserId: string;
      //   }) => {
      //     logInfo(
      //       `WEBRTC: ICE Candidate from ${senderUserId} to ${targetSocketId}`
      //     );
      //     this.io.to(targetSocketId).emit(VideoCallEvent.WEBRTC_ICE_CANDIDATE, {
      //       candidate,
      //       senderSocketId: socket.id, // ID socket của người gửi candidate
      //       senderUserId,
      //     });
      //   }
      // );

      // socket.on("disconnect", () => {
      //   logInfo(`Socket disconnected: ${socket.id}`);
      //   const user = connectedUsers.get(socket.id);
      //   if (user) {
      //     // Nếu người dùng đang trong phòng video, thông báo họ rời đi
      //     if (user.roomId && videoRooms.has(user.roomId)) {
      //       const participants = videoRooms.get(user.roomId)!;
      //       videoRooms.set(
      //         user.roomId,
      //         participants.filter((id) => id !== socket.id)
      //       );
      //       if (videoRooms.get(user.roomId)?.length === 0) {
      //         videoRooms.delete(user.roomId);
      //       }
      //       // Thông báo cho những người còn lại
      //       socket.to(user.roomId).emit(VideoCallEvent.USER_LEFT_VIDEO_ROOM, {
      //         peerId: socket.id,
      //         userId: user.userId,
      //       });
      //       logInfo(
      //         `User ${user.userName} (${user.userId}) automatically left video room ${user.roomId} on disconnect.`
      //       );
      //     }
      //     // Xóa người dùng khỏi danh sách connectedUsers
      //     connectedUsers.delete(socket.id);
      //   }
      // });
    });
  }
}
