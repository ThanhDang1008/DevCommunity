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
    if (file.mimetype.startsWith("image/")) {
      uploadPath = config.PATH_STORAGE_IMAGE;
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
    cb(null, originalname + "-" + Date.now() + "." + "webp");
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  //các định dạng file ảnh image
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    req.body.message = i18n.__("modules.s3.only-accept-image");
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const uploadImage: multerType.Multer = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.MAX_FILE_IMAGE_SIZE,
  },
});

export default uploadImage;
