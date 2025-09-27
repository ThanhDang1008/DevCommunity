import multer from "multer";
import multerType, { FileFilterCallback } from "multer";
import { Request } from "express";

import { config } from "@/config.app";
import i18n from "@/shared/utils/language/i18n";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //console.log('file', file);
    // file {
    //     fieldname: 'image1',
    //     originalname: 'Screenshot 2024-03-05 165924.png',
    //     encoding: '7bit',
    //     mimetype: 'image/png'
    //   }
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    let uploadPath = "";
    if (file.mimetype.startsWith("video/")) {
      uploadPath = config.PATH_STORAGE_VIDEO;
    } else {
      uploadPath = config.PATH_STORAGE_TRASH;
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    //  {
    //   fieldname: 'file',
    //   originalname: 'Screenshot 2025-03-01 150009.png',
    //   encoding: '7bit',
    //   mimetype: 'image/png'
    // }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    const originalname = file.originalname.split(".").shift();

    //cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
    cb(null, originalname + "-" + Date.now() + "." + fileExtension);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  //các định dạng file video
  const allowedMimeTypes = [
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/x-ms-wmv",
    "video/x-msvideo",
    "video/3gpp",
    "video/x-flv",
    "video/x-matroska",
    "video/ogg",
    "video/avi",
    "video/mpeg",
    "video/x-ms-asf",
    "video/x-m4v",
    "video/x-msvideo",
    "video/3gpp2",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    req.body.message = i18n.__("modules.s3.only-accept-video");
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const uploadVideo: multerType.Multer = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.MAX_FILE_VIDEO_SIZE,
  },
});

export default uploadVideo;
