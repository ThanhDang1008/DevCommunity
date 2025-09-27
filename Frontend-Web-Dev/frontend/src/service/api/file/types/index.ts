export interface IFile {
  _id: string;
  bucket: string;
  url: string;
  key: string;
  mimetype: string;
  originalname: string;
  size: number;
  author: {
    fullname: string;
    avatar: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};

export type GetListFileResponse = {
  message: string;
  currentPage: number;
  totalFiles: number;
  totalPages: number;
  data: IFile[];
};

export type UploadFileResponse = {
  statusCode: number;
  message: string;
  data: {
    url: string;
  };
};

export type GetFileStatisticsResponse = {
  message: string;
  data: {
    totalSize: number;
    totalSizeDescription: string;
    count: number;
    detail:
      | {
          mimetype: string;
          totalSize: number;
          totalSizeDescription: string;
          count: number;
        }[]
      | [];
  };
};

export type uploadFileStreamResponse = {
  message: string;
  chunkIndex: number;//bắt đầu từ 0
  totalChunks: number;
  fileName: string;
  mimetype: string;
  url?: string;
  key?: string;
};
