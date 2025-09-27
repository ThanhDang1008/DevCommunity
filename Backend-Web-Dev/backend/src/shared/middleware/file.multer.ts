import multer from "multer";
import multerType from "multer";

import { config } from "@/config.app";

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
    uploadPath = config.PATH_STORAGE_FILE;

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

const uploadFile: multerType.Multer = multer({
  storage: storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
});

export default uploadFile;
