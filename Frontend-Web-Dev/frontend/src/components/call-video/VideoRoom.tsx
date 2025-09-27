// app/test/call-video/[roomId]/page.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { socketChatService } from "@/service/socket/chat/socketInstance";
import { clsx } from "clsx";
// import { getTokenAuth2 } from '@/components/auth/TokenAuth2'; // Hàm lấy token của bạn nếu cần xác thực
// import { generateUniqueId } from '@/lib/utils'; // Hàm tiện ích để tạo ID duy nhất

// Định nghĩa các sự kiện Video Call (phải khớp với backend)
enum VideoCallEvent {
  JOIN_VIDEO_ROOM = "join-video-room",
  LEAVE_VIDEO_ROOM = "leave-video-room",
  USER_JOINED_VIDEO_ROOM = "user-joined-video-room",
  USER_LEFT_VIDEO_ROOM = "user-left-video-room",
  CURRENT_VIDEO_ROOM_PARTICIPANTS = "current-video-room-participants",
  WEBRTC_OFFER = "webrtc-offer",
  WEBRTC_ANSWER = "webrtc-answer",
  WEBRTC_ICE_CANDIDATE = "webrtc-ice-candidate",
}

// Định nghĩa một interface cho Peer Connection State
interface PeerConnectionState {
  peerConnection: RTCPeerConnection;
  userId: string;
  userName: string;
  remoteStream?: MediaStream; // Stream từ peer này
}

// Cấu hình ICE Servers (quan trọng cho WebRTC hoạt động qua NAT/Firewall)
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    // Thêm các máy chủ TURN nếu bạn cần vượt qua các mạng phức tạp
    // { urls: 'turn:your-turn-server.com:3478', username: 'user', credential: 'password' },
  ],
};

const CallVideoPage = (props: { roomId: string }) => {
  //const { roomId } = useParams<{ roomId: string }>();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerConnectionState[]>([]); // Danh sách các peer trong nhóm
  // peersRef sẽ lưu trữ RTCPeerConnection objects theo userId để dễ dàng truy cập và quản lý
  const peersRef = useRef<Record<string, PeerConnectionState>>({});

  const [name, setName] = useState(""); // Tên của người dùng hiện tại
  const [mySocketId, setMySocketId] = useState(""); // Socket ID của người dùng hiện tại
  const [myUserId, setMyUserId] = useState(""); // User ID của người dùng hiện tại (lấy từ token hoặc localStorage)

  const myVideoRef = useRef<HTMLVideoElement>(null);
  // userVideoRefs sẽ lưu trữ các ref tới thẻ video của các peer khác theo userId
  const userVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const generateUniqueId = useCallback(() => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }, []);

  // 1. Lấy tên và ID người dùng giả định (thay bằng logic lấy từ auth)
  useEffect(() => {
    // Generate unique IDs for demo purposes. In a real app, these would come from your auth system.
    let storedUserId = localStorage.getItem("user_id");
    let storedUserName = localStorage.getItem("user_name");

    if (!storedUserId) {
      storedUserId = `user_${generateUniqueId()}`;
      localStorage.setItem("user_id", storedUserId);
    }
    if (!storedUserName) {
      storedUserName = `Guest_${generateUniqueId().substring(0, 6)}`;
      localStorage.setItem("user_name", storedUserName);
    }

    setName(storedUserName);
    setMyUserId(storedUserId);
  }, []);

  // 2. Lấy My Stream và Kết nối Socket.IO
  useEffect(() => {
    if (!name || !props.roomId || !myUserId) return;

    socketChatService.connect();
    socketChatService.socketConnectionEvents();

    // Lắng nghe sự kiện socket 'connect'
    socketChatService.on("connect", () => {
      const currentSocketId = socketChatService.getSocketId();
      if (currentSocketId) {
        setMySocketId(currentSocketId);
        console.log("My socket ID:", currentSocketId);
        // Khi socket đã kết nối, join phòng video
        socketChatService.emit(VideoCallEvent.JOIN_VIDEO_ROOM, { roomId: props.roomId });
      }
    });

    // Lấy stream của mình (video và audio)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error getting media devices:", err);
        alert(
          "Bạn cần cấp quyền truy cập camera và microphone để thực hiện cuộc gọi."
        );
      });

    // Cleanup khi component unmount
    return () => {
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop()); // Tắt camera/mic
      }
      socketChatService.emit(VideoCallEvent.LEAVE_VIDEO_ROOM, { roomId: props.roomId }); // Báo server rời phòng
      socketChatService.disconnect();
      socketChatService.removeAllListeners();
      // Đóng tất cả các RTCPeerConnection khi rời khỏi trang
      Object.values(peersRef.current).forEach((p) => p.peerConnection.close());
      peersRef.current = {};
    };
  }, [name, props.roomId, myUserId]); // Dependencies để useEffect chạy lại khi các giá trị này thay đổi

  // 3. Xử lý logic WebRTC khi có My Stream và Socket ID của mình
  useEffect(() => {
    if (!myStream || !mySocketId || !myUserId) return;

    // Hàm tạo và cấu hình một RTCPeerConnection mới
    const createPeerConnection = (
      peerUserId: string,
      peerUserName: string,
      peerSocketId: string,
      isInitiator: boolean // Người tạo offer là true, người nhận offer là false
    ): RTCPeerConnection => {
      // Nếu đã có peer connection với người này, trả về cái đã có (tránh tạo trùng lặp)
      if (peersRef.current[peerUserId]?.peerConnection) {
        return peersRef.current[peerUserId].peerConnection;
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Thêm các track từ stream của mình vào peer connection để gửi đi
      myStream.getTracks().forEach((track) => pc.addTrack(track, myStream));

      // Lắng nghe sự kiện khi có ICE candidate mới được tạo ra
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(
            `WEBRTC: Sending ICE candidate to ${peerUserName} (${peerUserId})`
          );
          // Gửi ICE candidate qua Socket.IO đến peer đối diện
          socketChatService.emit(VideoCallEvent.WEBRTC_ICE_CANDIDATE, {
            targetSocketId: peerSocketId,
            candidate: event.candidate,
            senderUserId: myUserId,
          });
        }
      };

      // Lắng nghe sự kiện khi nhận được remote stream từ peer
      pc.ontrack = (event) => {
        console.log(
          `WEBRTC: Received remote stream from ${peerUserName} (${peerUserId})`
        );
        // Cập nhật state để hiển thị video của peer mới/cập nhật
        setPeers((prevPeers) => {
          const existingPeerIndex = prevPeers.findIndex(
            (p) => p.userId === peerUserId
          );
          const newPeerState = {
            peerConnection: pc,
            userId: peerUserId,
            userName: peerUserName,
            remoteStream: event.streams[0],
          };

          if (existingPeerIndex > -1) {
            // Cập nhật peer đã tồn tại
            const updatedPeers = [...prevPeers];
            updatedPeers[existingPeerIndex] = newPeerState;
            return updatedPeers;
          } else {
            // Thêm peer mới
            return [...prevPeers, newPeerState];
          }
        });
        // Cập nhật ref để giữ trạng thái mới nhất cho các logic khác
        peersRef.current[peerUserId] = {
          ...peersRef.current[peerUserId],
          remoteStream: event.streams[0],
        };
      };

      // Xử lý sự kiện thay đổi trạng thái kết nối
      pc.onconnectionstatechange = () => {
        console.log(
          `Connection state with ${peerUserName} (${peerUserId}): ${pc.connectionState}`
        );
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          console.log(`Peer ${peerUserName} disconnected or failed. Removing.`);
          // Xóa peer khỏi danh sách nếu kết nối bị mất
          setPeers((prevPeers) =>
            prevPeers.filter((p) => p.userId !== peerUserId)
          );
          if (peersRef.current[peerUserId]) {
            peersRef.current[peerUserId].peerConnection.close();
            delete peersRef.current[peerUserId];
          }
        }
      };

      // Lưu lại peer connection vào ref ngay lập tức
      peersRef.current[peerUserId] = {
        peerConnection: pc,
        userId: peerUserId,
        userName: peerUserName,
      };
      return pc;
    };

    // --- Socket.IO Event Handlers for WebRTC Signaling ---

    // 3.1. Khi có người dùng mới tham gia phòng video (server thông báo)
    socketChatService.on(
      VideoCallEvent.USER_JOINED_VIDEO_ROOM,
      async ({
        peerId,
        userId,
        userName,
      }: {
        peerId: string;
        userId: string;
        userName: string;
      }) => {
        console.log(`User ${userName} (${userId}) joined, peer ID: ${peerId}`);

        if (userId === myUserId || peersRef.current[userId]) {
          console.warn(
            `Ignoring user-joined for self or existing peer: ${userId}`
          );
          return;
        }

        // Tạo RTCPeerConnection mới. Client hiện tại là người tạo offer (initiator: true)
        const pc = createPeerConnection(userId, userName, peerId, true);

        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          console.log(
            `WEBRTC: Sending offer to new user ${userName} (${userId})`
          );
          // Gửi SDP Offer qua Socket.IO
          socketChatService.emit(VideoCallEvent.WEBRTC_OFFER, {
            targetSocketId: peerId,
            sdp: pc.localDescription,
            senderUserId: myUserId,
            senderUserName: name,
          });
        } catch (error) {
          console.error("Error creating offer for new user:", error);
        }
      }
    );

    // 3.2. Khi người mới join phòng, họ nhận được danh sách những người đã có (server thông báo)
    socketChatService.on(
      VideoCallEvent.CURRENT_VIDEO_ROOM_PARTICIPANTS,
      (
        participants: { socketId: string; userId: string; userName: string }[]
      ) => {
        console.log("Current participants:", participants);
        participants.forEach(async (participant) => {
          if (
            participant.userId === myUserId ||
            peersRef.current[participant.userId]
          ) {
            console.warn(
              `Ignoring existing participant for self or already added: ${participant.userName}`
            );
            return;
          }

          // Tạo RTCPeerConnection mới. Client hiện tại là người tạo offer (initiator: true)
          const pc = createPeerConnection(
            participant.userId,
            participant.userName,
            participant.socketId,
            true
          );

          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log(
              `WEBRTC: Sending offer to existing user ${participant.userName} (${participant.userId})`
            );
            // Gửi SDP Offer qua Socket.IO
            socketChatService.emit(VideoCallEvent.WEBRTC_OFFER, {
              targetSocketId: participant.socketId,
              sdp: pc.localDescription,
              senderUserId: myUserId,
              senderUserName: name,
            });
          } catch (error) {
            console.error("Error creating offer for existing user:", error);
          }
        });
      }
    );

    // 3.3. Xử lý khi nhận được SDP Offer từ một peer khác
    socketChatService.on(
      VideoCallEvent.WEBRTC_OFFER,
      async ({
        sdp,
        senderSocketId,
        senderUserId,
        senderUserName,
      }: {
        sdp: RTCSessionDescriptionInit;
        senderSocketId: string;
        senderUserId: string;
        senderUserName: string;
      }) => {
        console.log(
          `WEBRTC: Received offer from ${senderUserName} (${senderUserId})`
        );
        let pc = peersRef.current[senderUserId]?.peerConnection;

        if (!pc) {
          // Nếu chưa có RTCPeerConnection cho peer này, tạo mới và không phải initiator
          pc = createPeerConnection(
            senderUserId,
            senderUserName,
            senderSocketId,
            false
          );
        }

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          console.log(
            `WEBRTC: Sending answer to ${senderUserName} (${senderUserId})`
          );
          // Gửi SDP Answer qua Socket.IO
          socketChatService.emit(VideoCallEvent.WEBRTC_ANSWER, {
            targetSocketId: senderSocketId,
            sdp: pc.localDescription,
            senderUserId: myUserId,
          });
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      }
    );

    // 3.4. Xử lý khi nhận được SDP Answer từ một peer khác
    socketChatService.on(
      VideoCallEvent.WEBRTC_ANSWER,
      async ({
        sdp,
        senderSocketId,
        senderUserId,
      }: {
        sdp: RTCSessionDescriptionInit;
        senderSocketId: string;
        senderUserId: string;
      }) => {
        console.log(`WEBRTC: Received answer from ${senderUserId}`);
        const pc = peersRef.current[senderUserId]?.peerConnection;
        // Chỉ set remote description nếu không ở trạng thái stable
        // Tránh lỗi khi set remote description nhiều lần hoặc khi signaling state không phù hợp
        if (pc && pc.signalingState !== "stable") {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          } catch (error) {
            console.error(
              "Error setting remote description for answer:",
              error
            );
          }
        } else {
          console.warn(
            `WEBRTC: PeerConnection for ${senderUserId} not found or not in expected signaling state for answer.`
          );
        }
      }
    );

    // 3.5. Xử lý khi nhận được ICE Candidate từ một peer khác
    socketChatService.on(
      VideoCallEvent.WEBRTC_ICE_CANDIDATE,
      async ({
        candidate,
        senderSocketId,
        senderUserId,
      }: {
        candidate: RTCIceCandidateInit;
        senderSocketId: string;
        senderUserId: string;
      }) => {
        console.log(`WEBRTC: Received ICE candidate from ${senderUserId}`);
        const pc = peersRef.current[senderUserId]?.peerConnection;
        if (pc) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        } else {
          console.warn(
            `WEBRTC: PeerConnection for ${senderUserId} not found for ICE candidate.`
          );
        }
      }
    );

    // 3.6. Khi có người rời phòng (server thông báo)
    socketChatService.on(
      VideoCallEvent.USER_LEFT_VIDEO_ROOM,
      ({ peerId, userId }: { peerId: string; userId: string }) => {
        console.log(`User ${userId} (socket ID: ${peerId}) left the room.`);
        const leftPeer = peersRef.current[userId];
        if (leftPeer) {
          leftPeer.peerConnection.close(); // Đóng kết nối WebRTC với peer đã rời đi
          delete peersRef.current[userId]; // Xóa khỏi ref
          setPeers((prevPeers) => prevPeers.filter((p) => p.userId !== userId)); // Xóa khỏi state để cập nhật UI
        }
      }
    );

    // Cleanup listeners khi component unmount
    return () => {
      socketChatService.off(VideoCallEvent.USER_JOINED_VIDEO_ROOM);
      socketChatService.off(VideoCallEvent.CURRENT_VIDEO_ROOM_PARTICIPANTS);
      socketChatService.off(VideoCallEvent.WEBRTC_OFFER);
      socketChatService.off(VideoCallEvent.WEBRTC_ANSWER);
      socketChatService.off(VideoCallEvent.WEBRTC_ICE_CANDIDATE);
      socketChatService.off(VideoCallEvent.USER_LEFT_VIDEO_ROOM);
    };
  }, [myStream, mySocketId, myUserId, name]);

  // Hàm xử lý khi rời cuộc gọi
  const leaveCall = () => {
    // Đóng tất cả các RTCPeerConnection
    Object.values(peersRef.current).forEach((p) => p.peerConnection.close());
    peersRef.current = {};
    setPeers([]); // Xóa tất cả peer khỏi UI

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop()); // Tắt camera/mic của mình
      setMyStream(null);
    }
    socketChatService.emit(VideoCallEvent.LEAVE_VIDEO_ROOM, { roomId: props.roomId }); // Báo server rời phòng
    socketChatService.disconnect();
    // Tải lại trang hoặc chuyển hướng đến trang khác
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Video Call Room: {props.roomId}</h1>
      <p className="text-lg mb-4">
        Your ID: {myUserId} (Name: {name}) - Socket ID: {mySocketId}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {/* Video của bạn */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-3 py-1 rounded-md text-sm">
            You ({name})
          </div>
        </div>

        {/* Video của các peer khác */}
        {peers.map((p, index) => (
          <div
            key={p.userId}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden relative"
          >
            <video
              ref={(el) => {
                userVideoRefs.current[p.userId] = el;
                // Gán srcObject khi ref và stream có sẵn
                if (el && p.remoteStream) {
                  el.srcObject = p.remoteStream;
                }
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-3 py-1 rounded-md text-sm">
              {p.userName}
            </div>
          </div>
        ))}

        {/* Hiển thị thông báo nếu chưa có ai khác trong phòng */}
        {peers.length === 0 && myStream && (
          <div className="bg-gray-700 rounded-lg shadow-lg flex items-center justify-center p-8 text-xl text-gray-400">
            Waiting for other participants...
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        {/* Nút kết thúc cuộc gọi */}
        {(myStream || peers.length > 0) && (
          <button
            onClick={leaveCall}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            End Call
          </button>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-4">
        Chỉ cần chia sẻ đường link này `http://localhost:3000/test/call-video/
        {props.roomId}` với bạn bè để họ tham gia cuộc gọi!
      </p>
    </div>
  );
};

export default CallVideoPage;
export { CallVideoPage };
