"use client";

import { useState } from "react";

import { PageAdmin } from "../_components/page-admin";
// import StreamUploadFile from "@/modules/file/StreamUploadFile";
// import ModalUploadStream from "@/components/ui/modal/ModalUploadStream";
// import VideoPlayer as VideoPlayerHLS from "@/components/video/video-player-hls";
// import {VideoPlayer} from "@/components/ui/video/video-player";

export default function Page() {
  const [isOpenModalUploadStream, setIsOpenModalUploadStream] =
    useState<boolean>(false);
  return (
    <PageAdmin>
      <h1 className="text-2xl font-semibold mb-6 text-red-500 dark:text-sky-700">
        Thông tin
      </h1>
      {/* <StreamUploadFile
        title={"Tải lên file lớn với Node.js Stream"}
        description={"Hỗ trợ lên đến 10GB:"}
      /> */}
      {/* <button
        className="btn btn-primary hover:bg-blue-700"
        type="button"
        onClick={() => setIsOpenModalUploadStream(true)}
      >
        Tải lên
      </button> */}

      {/* <div className="">
        <VideoPlayerHLS src="https://api.minwandev.io.vn/api/v1/s3/file/video/stream/iLoveYt-1748273047496.m3u8" />
      </div> */}

      {/* <div className="h-2/5">
        <VideoPlayer
          src={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"}
          style={
            {
              height:500
            }
          }
        />
      </div> */}
{/* 
      <ModalUploadStream
        isOpen={isOpenModalUploadStream}
        title={"Tải lên tập tin"}
        onOk={() => setIsOpenModalUploadStream(false)}
        onCancel={() => setIsOpenModalUploadStream(false)}
      /> */}
    </PageAdmin>
  );
}
