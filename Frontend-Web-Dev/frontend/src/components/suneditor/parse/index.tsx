"use client";

import clsx from "clsx";

import "./suneditor-parse.scss";
import parse, { DOMNode, Element } from "html-react-parser";
import "highlight.js/styles/github-dark.css";
import ImagePostViewer from "@/components/ui/Image/ImagePostViewer";

import { Theme } from "@/components/ThemeContext";
import { useTheme } from "@/components/ThemeContext";

interface ParseHTMLProps {
  html: string | undefined;
  styleLight?: React.CSSProperties;
  styleDark?: React.CSSProperties;
}

const ParseHTML = (props: ParseHTMLProps) => {
  const { theme } = useTheme();
  return (
    <>
      <div className={`suneditor-parse`}>
        {/* <div className="sun-editor"> */}
        <div className="se-container">
          <div className="se-wrapper">
            <div
              className={
                "bg-red-500 se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable"
              }
              style={{
                ...(theme === Theme.LIGHT_MODE
                  ? props.styleLight
                  : props.styleDark),
              }}
            >
              {/* <div dangerouslySetInnerHTML={{ __html: props.html || "" }} /> */}
              {parse(props.html || "", {
                transform(reactNode: any, domNode: DOMNode, index: number) {
                  //lấy ra đường dẫn trong thẻ video
                  //@ts-ignore
                  // if (domNode?.name === "iframe") {
                  //   //@ts-ignore
                  //   const src = domNode?.attribs?.src;
                  //   //@ts-ignore
                  //   const style = domNode?.attribs?.style;
                  //   const styleObject = style
                  //     ? style.split(";").reduce((acc: any, style: any) => {
                  //         const [key, value] = style.split(":");
                  //         if (key && value) {
                  //           acc[key.trim()] = value.trim();
                  //         }
                  //         return acc;
                  //       }, {})
                  //     : {};

                  //   // console.log("transform style: ", styleObject);
                  //   // console.log("transform style: ", style);
                  //   return (
                  //     <VideoPlayer style={styleObject} src={src} key={index} />
                  //   );
                  // }
                  //nếu nội dung thẻ p là http thì sẽ render ra thẻ a
                  //@ts-ignore
                  // if (domNode?.name === "p") {
                  //   //@ts-ignore
                  //   const src = domNode?.children[0]?.data;
                  //   if (
                  //     src &&
                  //     src.includes("https") &&
                  //     src.includes("http") &&
                  //     src.includes("www")
                  //   ) {
                  //     const parts = src.split(" ");
                  //     return (
                  //       <p key={index}>
                  //         {parts.map((part: any, i: any) =>
                  //           part.includes("https") ? (
                  //             <a href={part} key={i}>
                  //               {part}
                  //             </a>
                  //           ) : (
                  //             `${part} `
                  //           )
                  //         )}
                  //       </p>
                  //     );
                  //   }
                  // }
                  //nếu là thẻ img thì sẽ render ra thẻ Image
                  //@ts-nocheck
                  domNode = domNode as Element;
                  if (domNode?.name === "img" && domNode?.attribs?.src) {
                    return (
                      <ImagePostViewer
                        key={index}
                        src={domNode.attribs.src}
                        alt={domNode.attribs.alt || ""}
                      />
                    );
                  }
                  return reactNode;
                },
              })}
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default ParseHTML;
