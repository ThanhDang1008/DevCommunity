import fs from "fs";

import { config } from "@/config.app";
import { initFolder, deleteFolder } from "@/shared/utils/initFolder";
import { deleteFile } from "@/shared/utils/initFile";
import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";
import { initFileM3U8 } from "./initFileM3U8";

import ffmpeg from "fluent-ffmpeg";
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

export const convertVideoStream = async ({
  fileName,
  filePath,
}: {
  fileName: string;
  filePath: string;
}) => {
  const nameVideo = fileName.replace(/\.[^/.]+$/, ""); // Remove file extension
  const PATH_FOLDER_TS_VIDEO = `${config.PATH_STORAGE_VIDEO}${nameVideo}`;
  const PATH_M3U8_MASTER = `${config.PATH_STORAGE_VIDEO}${nameVideo}.m3u8`;
  try {
    // console.log("fileName: ", fileName);
    // console.log("filePath: ", filePath);
    // const UUID = crypto.randomUUID();
    // const { filename, destination, mimetype, originalname, size } = req.file;
    // const path = destination + filename;
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Example of req.file object {
    //   fieldname: 'file',
    //   originalname: 'Screenshot (96).png',
    //   encoding: '7bit',
    //   mimetype: 'image/png',
    //   destination: './upload/image/',
    //   filename: 'Screenshot (96) 1740931592570.png',
    //   path: 'upload\\image\\Screenshot (96) 1740931592570.png',
    //   size: 2066643
    // }

    await initFolder(PATH_FOLDER_TS_VIDEO).catch((error) => {
      throw error;
    });
    const PATH_M3U8_1080P = `${PATH_FOLDER_TS_VIDEO}/${nameVideo}_1080p_.m3u8`;
    const PATH_M3U8_720P = `${PATH_FOLDER_TS_VIDEO}/${nameVideo}_720p_.m3u8`;
    const PATH_M3U8_480P = `${PATH_FOLDER_TS_VIDEO}/${nameVideo}_480p_.m3u8`;
    const PATH_M3U8_360P = `${PATH_FOLDER_TS_VIDEO}/${nameVideo}_360p_.m3u8`;
    const PATH_M3U8_240P = `${PATH_FOLDER_TS_VIDEO}/${nameVideo}_240p_.m3u8`;
    const PATH_M3U8_144P = `${PATH_FOLDER_TS_VIDEO}/${nameVideo}_144p_.m3u8`;

    const MASTER_PATH_M3U8_1080P = `${nameVideo}/${nameVideo}_1080p_.m3u8`;
    const MASTER_PATH_M3U8_720P = `${nameVideo}/${nameVideo}_720p_.m3u8`;
    const MASTER_PATH_M3U8_480P = `${nameVideo}/${nameVideo}_480p_.m3u8`;
    const MASTER_PATH_M3U8_360P = `${nameVideo}/${nameVideo}_360p_.m3u8`;
    const MASTER_PATH_M3U8_240P = `${nameVideo}/${nameVideo}_240p_.m3u8`;
    const MASTER_PATH_M3U8_144P = `${nameVideo}/${nameVideo}_144p_.m3u8`;

    ffmpeg(filePath, {
      timeout: 432000, // 5 days
    })
      // .outputOptions([
      //   "-profile:v baseline",
      //   "-level 3.0",
      //   "-start_number 0",
      //   "-hls_time 10",
      //   "-hls_list_size 0",
      // ])

      // 144p (256x144)
      // .output(`${PATH_M3U8_144P}`)
      // .videoCodec("libx264")
      // .outputOptions([
      //   "-profile:v baseline",
      //   "-level 3.0",
      //   "-start_number 0",
      //   "-hls_time 10", //xác định thời lượng của mỗi segment video .ts (tính bằng giây)
      //   "-hls_list_size 0", //Giá trị 0 có nghĩa là không giới hạn số lượng segment trong playlist
      //   "-vf scale=w=256:h=144:force_original_aspect_ratio=decrease,pad=w=ceil(iw/2)*2:h=ceil(ih/2)*2",
      //   "-b:v 200k", // (0.2 Mbps)
      //   "-maxrate 300k", // (0.3 Mbps)
      //   "-bufsize 500k",
      // ])

      // 240p (426x240)
      //   .output(`${PATH_M3U8_240P}`)
      //   .videoCodec("libx264")
      //   .outputOptions([
      //     "-profile:v baseline",
      //     "-level 3.0",
      //     "-start_number 0",
      //     "-hls_time 10",
      //     "-hls_list_size 0",
      //     "-vf scale=w=426:h=240:force_original_aspect_ratio=decrease,pad=w=ceil(iw/2)*2:h=ceil(ih/2)*2",
      //     "-b:v 300k", // (0.3 Mbps)
      //     "-maxrate 500k", // (0.5 Mbps)
      //     "-bufsize 750k",
      //   ])

      // 360p (640x360)
      //   .output(`${PATH_M3U8_360P}`)
      //   .videoCodec("libx264")
      //   .outputOptions([
      //     "-profile:v baseline",
      //     "-level 3.0",
      //     "-start_number 0",
      //     "-hls_time 10", //xác định thời lượng của mỗi segment video .ts (tính bằng giây)
      //     "-hls_list_size 0", //Giá trị 0 có nghĩa là không giới hạn số lượng segment trong playlist
      //     // "-vf scale=-1:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2",
      //     "-vf scale=w=640:h=360:force_original_aspect_ratio=decrease,pad=w=ceil(iw/2)*2:h=ceil(ih/2)*2",
      //     "-b:v 500k", // (0.5 Mbps)
      //     "-maxrate 1000k", // (1 Mbps)
      //     "-bufsize 1500k",
      //   ])

      // 480p (854x480)
      // .output(`${PATH_M3U8_480P}`)
      // .videoCodec("libx264")
      // .outputOptions([
      //   "-profile:v baseline",
      //   "-level 3.0",
      //   "-start_number 0",
      //   "-hls_time 10",
      //   "-hls_list_size 0",
      //   "-vf scale=w=854:h=480:force_original_aspect_ratio=decrease,pad=w=ceil(iw/2)*2:h=ceil(ih/2)*2",
      //   "-b:v 1000k", // (1 Mbps)
      //   "-maxrate 2000k", // (2 Mbps)
      //   "-bufsize 3000k",
      // ])

      // 720p (1280x720)
      .output(`${PATH_M3U8_720P}`)
      .videoCodec("libx264")
      .outputOptions([
        "-profile:v baseline",
        "-level 3.0",
        "-start_number 0",
        "-hls_time 10", //xác định thời lượng của mỗi segment video .ts (tính bằng giây)
        "-hls_list_size 0", //Giá trị 0 có nghĩa là không giới hạn số lượng segment trong playlist
        "-vf scale=w=1280:h=720:force_original_aspect_ratio=decrease,pad=w=ceil(iw/2)*2:h=ceil(ih/2)*2",
        "-b:v 2000k", // (2 Mbps)
        "-maxrate 4000k", // (4 Mbps)
        "-bufsize 6000k",
      ])

      // 1080p (1920x1080)
      //   .output(`${PATH_M3U8_1080P}`)
      //   .videoCodec("libx264")
      //   .outputOptions([
      //     "-profile:v baseline",
      //     "-level 3.0",
      //     "-start_number 0",
      //     "-hls_time 10",
      //     "-hls_list_size 0",
      //     "-vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease,pad=w=ceil(iw/2)*2:h=ceil(ih/2)*2",
      //     "-b:v 3500k", // (3.5 Mbps)
      //     "-maxrate 8000k", // (8 Mbps)
      //     "-bufsize 12000k",
      //   ])

      .on("start", (commandLine) => {
        // console.log("🚀 FFmpeg command: ", commandLine);
        console.log(
          `🚀 ${formatToLocalDateTime(
            new Date().toISOString()
          )} Bắt đầu chuyển đổi HLS: ${
            config.PATH_STORAGE_VIDEO
          }${nameVideo}.m3u8
                `
        );
      })
      .on("end", async () => {
        console.log(
          `🎉 ${formatToLocalDateTime(
            new Date().toISOString()
          )} Chuyển đổi HLS thành công: ${
            config.PATH_STORAGE_VIDEO
          }${nameVideo}.m3u8`
        );

        await initFileM3U8(PATH_M3U8_MASTER, {
          //"144p": MASTER_PATH_M3U8_144P,
          //   "240p": MASTER_PATH_M3U8_240P,
          //   "360p": MASTER_PATH_M3U8_360P,
          //"480p": MASTER_PATH_M3U8_480P,
          "720p": MASTER_PATH_M3U8_720P,
          //   "1080p": MASTER_PATH_M3U8_1080P,
        }).catch((error) => {
          throw error;
        });

        //xoá file gốc
        //deleteVideo(path);
      })
      .on("error", (err) => {
        console.group();
        console.log(`❌ Chuyển đổi HLS thất bại: ${filePath}`);
        console.log("Reason: ", err);
        console.groupEnd();

        //deleteVideo(path);
        //deleteFolder(PATH_FOLDER_TS_VIDEO);

        throw err;
      })
      .on("progress", (progress) => {
        console.log(
          `📡 Đang chuyển đổi HLS: ${config.PATH_STORAGE_VIDEO}${nameVideo}.m3u8 - ${progress.timemark}`
        );
      })
      .on("stderr", (stderrLine) => {
        //debug
        //console.log("FFmpeg STDERR:", stderrLine);
      })
      .run();
    // deleteVideo(path);
    // deleteFolder(PATH_FOLDER_TS_VIDEO);

    return {
      status: "success",
      message: `Chuyển đổi video ${fileName} thành công`,
      pathM3U8Master: PATH_M3U8_MASTER,
      pathFolderTsVideo: PATH_FOLDER_TS_VIDEO,
    };
  } catch (error) {
    deleteFile(filePath)
    deleteFolder(PATH_FOLDER_TS_VIDEO);
    throw error;
  }
};
