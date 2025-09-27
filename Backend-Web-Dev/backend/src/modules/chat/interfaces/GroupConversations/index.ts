export interface ICreateGroupConversation {
  title: string;
  userId: string;
  description?: string;
  topics: string[];
  avatar?: string;
  nickname?: string;
  createdBy: string;
  isPublic?: boolean;
  members: {
    userId: string;
    nickname?: string;
  }[];
}
