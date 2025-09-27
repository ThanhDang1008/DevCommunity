"use client";

import { useState, useEffect } from "react";
import { Modal, message } from "antd";

import StreamUploadFile from "@/modules/file/StreamUploadFile";

type ModalUploadStreamProps = {
  isOpen: boolean;
  title?: string;
  onOk?: () => void;
  onCancel?: () => void;
  onUploadSuccess?: (data: {
    chunkIndex: number;
    totalChunks: number;
    fileName: string;
    mimetype: string;
    url: string;
    key: string;
    size: number; // Kích thước tập tin
  }) => void;
};

const ModalUploadStream = (props: ModalUploadStreamProps) => {
  return (
    <>
      <Modal
        title={props.title || "Tải lên tập tin"}
        open={props.isOpen || false}
        onOk={() => props.onOk?.()}
        onCancel={() => props.onCancel?.()}
        okText="Đóng"
        okType="default"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {props.isOpen && (
          <StreamUploadFile
            title={""}
            description={"Hỗ trợ lên đến 10GB"}
            onUploadSuccess={(data) => {
              props.onUploadSuccess?.(data);
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default ModalUploadStream;
export {
  ModalUploadStream, // Export the type for use in other components if needed
};
