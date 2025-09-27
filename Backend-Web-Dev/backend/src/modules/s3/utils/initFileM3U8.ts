import fs from "fs";

type TypeFileM3U8 = {
  "144p"?: string;
  "240p"?: string;
  "360p"?: string;
  "480p"?: string;
  "720p"?: string;
  "1080p"?: string;
};

//Lưu ý không format content_master_m3u8 vì nó sẽ bị lỗi khi chạy
export const initFileM3U8 = async (path: string, content: TypeFileM3U8) => {
  
const content_master_m3u8 = 
`#EXTM3U
#EXT-X-VERSION:4
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-ALLOW-CACHE:YES

${content["144p"] ? 
`#EXT-X-STREAM-INF:BANDWIDTH=250000,RESOLUTION=256x144,CODECS="avc1.42E01E,mp4a.40.2",NAME=144p
${content["144p"]}` : ""}
${content["240p"] ?
`#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=426x240,CODECS="avc1.42E01E,mp4a.40.2",NAME=240p
${content["240p"]}` : ""}
${content["360p"] ?
`#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,CODECS="avc1.4D401E,mp4a.40.2",NAME=360p
${content["360p"]}` : ""}
${content["480p"] ?
`#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480,CODECS="avc1.4D401E,mp4a.40.2",NAME=480p
${content["480p"]}` : ""}
${content["720p"] ?
`#EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1280x720,CODECS="avc1.4D4028,mp4a.40.2",NAME=720p
${content["720p"]}` : ""}
${content["1080p"] ?
`#EXT-X-STREAM-INF:BANDWIDTH=6000000,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2",NAME=1080p
${content["1080p"]}`: ""}

#EXT-X-ENDLIST
              `;
  try {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, content_master_m3u8, "utf-8");
      console.log(
        `--------------- Create file: ${path} success! ---------------`
      );
    }
  } catch (error) {
    console.error(
      `--------------- Create file: ${path} fail! ---------------`,
      error
    );
  }
};