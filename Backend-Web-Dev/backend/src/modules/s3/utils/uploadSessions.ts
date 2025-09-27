import path from "path";
import { logError, logSuccess } from "@/shared/utils/log";
import { config } from "@/config.app";
import { deleteFolderProcess } from "@/shared/utils/initFolder";

// Interface để track upload sessions
interface UploadSession {
  uploadId: string;
  fileName: string;
  totalChunks: number;
  receivedChunks: Set<number>;
  lastActivity: Date;
  userId: string;
  mimeType?: string;
}

// Global state cho upload sessions
const uploadSessions = new Map<string, UploadSession>();
let cleanupTimer: NodeJS.Timeout | null = null;

// Constants
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes (thời gian tối đa cho một session không hoạt động trước khi bị xóa)
//phiên hoạt động tối đa cho 1 chunk upload, nếu quá thời gian này thì sẽ xoá session
// const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL = 1 * 60 * 1000; // 1 minutes (khoảng thời gian giữa các lần cleanup)
//khoảng thời gian giữa các lần cleanup, để kiểm tra các session đã hết hạn và xoá chúng

// Tạo hoặc cập nhật session
export const createOrUpdateSession = (
  uploadId: string,
  fileName: string,
  totalChunks: number,
  userId: string,
  mimeType?: string
): void => {
  const existingSession = uploadSessions.get(uploadId);

  if (existingSession) {
    // Cập nhật thời gian hoạt động cuối
    existingSession.lastActivity = new Date();
  } else {
    logSuccess(
      `🚀 Creating new upload session: ${uploadId} for user: ${userId}`
    );
    // Tạo session mới
    uploadSessions.set(uploadId, {
      uploadId,
      fileName,
      totalChunks,
      receivedChunks: new Set(),
      lastActivity: new Date(),
      userId,
      mimeType,
    });
  }
};

// Đánh dấu chunk đã nhận
export const markChunkReceived = (
  uploadId: string,
  chunkIndex: number
): void => {
  // Kiểm tra xem session có tồn tại không
  const session = uploadSessions.get(uploadId);
  if (session) {
    logSuccess(
      `🧩 Marking chunk ${chunkIndex} as received for upload session: ${uploadId}`
    );
    // Thêm chunk vào danh sách đã nhận
    session.receivedChunks.add(chunkIndex);
    session.lastActivity = new Date(); //khi 1 chunk được thêm vào thì cập nhật lại thời gian hoạt động cuối
  }
};

// Kiểm tra xem đã nhận đủ chunks chưa
export const isUploadComplete = (uploadId: string): boolean => {
  const session = uploadSessions.get(uploadId);
  if (!session) return false;

  return session.receivedChunks.size === session.totalChunks;
};

// Xóa session
export const removeSession = (uploadId: string): void => {
  uploadSessions.delete(uploadId);
};

// Lấy thông tin session
export const getSession = (uploadId: string): UploadSession | undefined => {
  return uploadSessions.get(uploadId);
};

// Lấy thời gian còn lại (ms) trước khi session bị cleanup
export const getSessionTimeLeft = (uploadId: string): number | undefined => {
  const session = uploadSessions.get(uploadId);
  if (!session) return undefined;
  const now = Date.now();
  const last = session.lastActivity.getTime();
  const left = SESSION_TIMEOUT - (now - last);
  return left > 0 ? left : 0;
};
//---------------------------------------------------------
// Cleanup một session cụ thể
const cleanupSession = async (uploadId: string): Promise<void> => {
  try {
    const uploadSessionDir = path.join(config.PATH_STORAGE_FILE, uploadId);

    // Xóa folder chứa chunks
    await deleteFolderProcess(uploadSessionDir);

    // Xóa session khỏi memory
    uploadSessions.delete(uploadId);

    logSuccess(`Cleaned up session: ${uploadId}`);
  } catch (error) {
    logError("upload-cleanup", `Failed to cleanup session: ${uploadId}`, error);
  }
};

// Cleanup các session cũ
const cleanupExpiredSessions = async (): Promise<void> => {
  const now = new Date();
  const expiredSessions: string[] = [];

  //log ra danh sách các session
  logSuccess(`Danh sách các session upload hiện tại: `, uploadSessions);
  //   Current active upload sessions: Map(1) {
  //   'videotiktokmp4-1748444861451' => {
  //     uploadId: 'videotiktokmp4-1748444861451',
  //     fileName: 'video-tiktok.mp4',
  //     totalChunks: 7,
  //     receivedChunks: Set(5) { 0, 1, 2, 3, 4 },
  //     lastActivity: 2025-05-28T15:07:48.918Z,
  //     userId: '68287213fe5b2c6fc885d88b',
  //     mimeType: 'video/mp4'
  //   }
  // }

  // Tìm các session đã hết hạn
  for (const [uploadId, session] of uploadSessions.entries()) {
    const timeDiff = now.getTime() - session.lastActivity.getTime();
    if (timeDiff > SESSION_TIMEOUT) {
      expiredSessions.push(uploadId);
    }
  }

  // Cleanup các session hết hạn
  for (const uploadId of expiredSessions) {
    await cleanupSession(uploadId);
  }

//   if (expiredSessions.length > 0) {
//     logSuccess(`Cleaned up ${expiredSessions.length} expired upload sessions`);
//   }

  //nếu uploadSessions là rỗng thì dừng timer cleanup
  if (uploadSessions.size === 0) {
    stopCleanupTimer();
  }
};
//---------------------------------------------------------
//---------------------------------------------------------
// Bắt đầu timer cleanup
export const startCleanupTimer = (): void => {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
  }

  logSuccess(`⏰ Starting cleanup timer with interval: ${CLEANUP_INTERVAL} ms`);
  cleanupTimer = setInterval(() => {
    cleanupExpiredSessions();
  }, CLEANUP_INTERVAL);
};

// Dừng timer cleanup (dùng khi shutdown app)
export const stopCleanupTimer = (): void => {
  if (cleanupTimer) {
    logSuccess(`⏰ Stopping cleanup timer`);
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
};
//---------------------------------------------------------

// Cleanup manual một session
export const forceCleanupSession = async (uploadId: string): Promise<void> => {
  await cleanupSession(uploadId);
};

// Lấy danh sách các session đang active
export const getActiveSessions = (): (UploadSession & {
  timeLeftMs: number;
})[] => {
  return Array.from(uploadSessions.values()).map((session) => ({
    ...session,
    timeLeftMs: getSessionTimeLeft(session.uploadId) ?? 0,
  }));
};

//chỉ xoá session không xoá folder
export const clearSessionOnly = (uploadId: string): void => {
  const session = uploadSessions.get(uploadId);
  if (session) {
    logSuccess(`🗑️ Clearing session only: ${uploadId}`);
    uploadSessions.delete(uploadId);
  } else {
    logError(
      "uploadSessions",
      `Session not found: ${uploadId}`,
      new Error("Session not found")
    );
  }
};
