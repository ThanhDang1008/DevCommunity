"use client";

import { Image } from "antd";

type ImagePostViewerProps = {
  src: string;
  alt: string;
};

const ImagePostViewer = (props: ImagePostViewerProps) => {
  return (
    <>
      <Image
        //custom chữ preview
        preview={{
          mask: (
            <i
              style={{
                display: "none",
              }}
              className="bi bi-search"
            ></i>
          ),
          style: {
            // backgroundColor: "black",
            // color: "white",
            // borderRadius: "50%",
          },
          toolbarRender: () => null,
          footer: (
            <span
              style={{
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: "#393939",
                padding: "3px",
                borderRadius: "5px",
              }}
            >
              {props.alt || ""}
            </span>
          ),
        }}
        src={props.src}
        alt={props.alt || ""} // Ensure alt is a string
      />
    </>
  );
};

export default ImagePostViewer;
