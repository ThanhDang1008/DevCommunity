import { keyJWT } from "@/constants/common";
import Session, { ISession } from "../schemes/session.model";

class SessionService {
  public async createSession(
    key: string,
    value: {
      id_user: string;
      email: string;
    },
    token: string | null = null
  ): Promise<any> {
    try {
      const session = await Session.create({
        session_id: key,
        id_user: value.id_user,
        email: value.email,
        expired_at: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
        token: token || "", // Optional field for JWT key
      });
      return session;
    } catch (error) {
      throw error;
    }
  }

  public async getSessionByKey(key: string): Promise<ISession | null> {
    try {
      const session = await Session.findOne({ session_id: key });
      return session;
    } catch (error) {
      throw error;
    }
  }

  public async deleteSessionByKey(key: string): Promise<any> {
    try {
      const session = await Session.deleteOne({ session_id: key });
      return session;
    } catch (error) {
      throw error;
    }
  }

  public async deleteSessionByEmail(email: string): Promise<any> {
    try {
      const session = await Session.deleteMany({ "value.email": email });
      // console.log("session", session); //{ acknowledged: true, deletedCount: 2 }
      if (!session) return null;
      return session;
    } catch (error) {
      return null;
      //throw error;
    }
  }
}

export const sessionService: SessionService = new SessionService();
