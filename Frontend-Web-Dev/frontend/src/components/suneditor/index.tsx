"use client";

// import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import "./suneditor.scss";
import "katex/dist/katex.min.css";
// import "highlight.js/styles/github.css"; // Add highlight.js CSS
import "highlight.js/styles/github-dark.css";
import dynamic from "next/dynamic";
import {
  useRef,
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import katex from "katex";
import plugins from "suneditor/src/plugins";

import { uploadImageS3, uploadVideoS3 } from "@/service/api/upload";
import { UploadInfo } from "suneditor-react/dist/types/upload";

import {
  buttonListOptions,
  langOptions,
  colorListOptions,
} from "./suneditor.options";
import {
  clearContentPlugin,
  warningBlockPlugin,
  customCodeHighlight,
  AutoHeadingIdPlugin,
} from "./suneditor.plugins";
import { TableOfContents } from "@/components/ui/table/TableOfContents";
import ParseHTML from "./parse";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

type SuneEditorProps = {
  disable?: boolean;
  buttonList?: (string | string[][])[][]
  isShowToc?: boolean;
};

export type SuneEditorRef = {
  getHtmlContent: () => string;
  clearHtmlContent: () => void;
  getLink: () => {
    image: string[];
    video: string[];
  };
  getToc: () => {
    title: string;
    id: string;
    tag: "h2" | "h3" | "h4" | "h5" | "h6";
  }[];
  clearAll: () => void;
  clearLink: () => void;
  setHtmlContent: (value: string) => void;
  setLink: (value: { image: string[]; video: string[] }) => void;
};

const SuneEditor = (props: SuneEditorProps, ref: Ref<SuneEditorRef>) => {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState("");

  const [linkImage, setLinkImage] = useState<string[]>([]);
  const [linkVideo, setLinkVideo] = useState<string[]>([]);

  const [urlImage, setUrlImage] = useState<string[]>([]);
  const [urlVideo, setUrlVideo] = useState<string[]>([]);

  const [tocContent, setTocContent] = useState<
    { title: string; id: string; tag: "h2" | "h3" | "h4" | "h5" | "h6" }[]
  >([]);

  useEffect(() => {
    setUrlImage([...urlImage, ...linkImage]);
  }, [linkImage]);

  useEffect(() => {
    setUrlVideo([...urlVideo, ...linkVideo]);
  }, [linkVideo]);

  // console.log("urlImage: ", urlImage);
  // console.log("urlVideo: ", urlVideo);

  useImperativeHandle(ref, () => ({
    getHtmlContent: () => content,
    clearHtmlContent: () => handleSetContent(""),
    getLink: () => ({
      image: urlImage,
      video: urlVideo,
    }),
    getToc: () => tocContent,
    clearAll: () => {
      handleSetContent("");
      setLinkImage([]);
      setLinkVideo([]);
      setUrlImage([]);
      setUrlVideo([]);
    },
    clearLink: () => {
      setLinkImage([]);
      setLinkVideo([]);
      setUrlImage([]);
      setUrlVideo([]);
    },
    setHtmlContent: (value) => handleSetContent(value),
    setLink: (value: { image: string[]; video: string[] }) => {
      setLinkImage(value.image);
      setLinkVideo(value.video);
    },
  }));

  // useEffect(() => {
  //   if (editorRef.current) {
  //     const editorDiv = editorRef.current.editor.core.context.element.wysiwyg;
  //     editorDiv.setAttribute("spellcheck", "false");
  //   }
  // }, []);
  const handleFocus = (event: any) => {
    event.target.setAttribute("spellcheck", "false");
  };

  const handleImageUpload = (
    targetImgElement: HTMLImageElement,
    index: number,
    state: "create" | "update" | "delete",
    imageInfo: UploadInfo<HTMLImageElement>,
    remainingFilesCount: number
  ) => {
    if (state === "delete") {
      const imageUrl = targetImgElement?.src;
      // console.log("imageUrl: ", imageUrl);
      // console.log("targetImgElement: ", targetImgElement);
      // console.log("imageInfo: ", imageInfo);

      // Gọi API xoá ảnh trên S3
      // deleteImageS3(imageUrl)
      //     .then(() => {
      //         console.log("Ảnh đã được xoá khỏi S3:", imageUrl);
      //     })
      //     .catch((error) => {
      //         console.error("Lỗi xoá ảnh:", error);
      //     });
    }
  };

  const handleContentChange = () => {
    const rawHTML =
      editorRef.current?.core?.context?.element?.wysiwyg?.innerHTML;
    //console.log("Clean rawHTML from DOM:", rawHTML);
    setContent(rawHTML || ""); // Cập nhật nội dung
  };

  const handleSetContent = (content: string) => {
    if (editorRef?.current) {
      const editableArea = editorRef?.current?.core?.context?.element?.wysiwyg;
      if (editableArea) {
        editableArea.innerHTML = content; // Cập nhật nội dung của editor
        setContent(content); // Cập nhật state content
      }
    }
  };

  // useEffect(() => {
  //   // console.log("Content updated: ", content);
  //   // console.log("Editor instance: ", editorRef.current);
  //   if (editorRef?.current) {
  //     const editableArea = editorRef?.current?.core?.context?.element?.wysiwyg;
  //     if (editableArea) {
  //       editableArea.innerHTML = content; // Cập nhật nội dung của editor
  //     }
  //   }
  // }, [content]);

  const generateTOC = (content: string) => {
    const toc: {
      title: string;
      id: string;
      tag: "h2" | "h3" | "h4" | "h5" | "h6";
    }[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h2, h3, h4, h5, h6");

    headings.forEach((heading) => {
      const id = heading.getAttribute("id");
      if (id) {
        // Loại bỏ ký tự # ở đầu tiêu đề nếu có
        let title = heading.textContent || "";
        title = title.replace(/^#+\s*/, "");
        const tag = heading.tagName.toLowerCase() as
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6";
        toc.push({ title, id, tag });
      }
    });

    return toc;
  };

  useEffect(() => {
    if (content) {
      const toc = generateTOC(content);
      setTocContent(toc);
    }
  }, [content]);

  // console.log("tocContent: ", tocContent);

  return (
    <>
      {props.isShowToc && (
        <TableOfContents
          items={tocContent}
          className="w-full sm:w-9/12 md:w-2/5 mb-3"
        />
      )}

      <div className="suneditor">
        <SunEditor
          disable={props?.disable || false}
          height="auto"
          onFocus={handleFocus}
          setOptions={{
            plugins: [
              ...Object.values(plugins),
              clearContentPlugin,
              warningBlockPlugin,
              customCodeHighlight,
              AutoHeadingIdPlugin,
            ],
            //placeholder: "Hãy viết gì đó...",

            katex: katex,
            // image
            imageFileInput: true,
            imageAccept: "image/*",
            imageUploadSizeLimit: 10 * 1024 * 1024, //10MB

            //video
            videoUploadUrl: "/api/v1/s3/video/upload",
            videoFileInput: true,
            videoAccept: "video/*",
            videoUploadSizeLimit: 100 * 1024 * 1024, //100MB

            buttonList: props?.buttonList || buttonListOptions,

            colorList: colorListOptions,

            previewTemplate: `<div style='width:auto; max-width:1080px; margin:auto;'>
                 <h1>Preview Template</h1> 
                       {{contents}} 
                   <div>_Footer_</div>
                </div>`,
            lineHeights: [
              { text: "0.5", value: 0.5 },
              { text: "Single", value: 1 },
              { text: "1.25", value: 1.25 },
              { text: "1.5", value: 1.5 },
              { text: "1.75", value: 1.75 },
              { text: "Double", value: 2 },
              { text: "2.25", value: 2.25 },
              { text: "2.5", value: 2.5 },
              { text: "2.75", value: 2.75 },
              { text: "3", value: 3 },
            ],
            formats: [
              "p",
              "div",
              "blockquote",
              "pre",
              // "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
            ],
            font: [
              "Arial",
              "Times New Roman",
              "Impact",
              "Comic Sans MS",
              "Arial Black",
              "Courier New",
              "Verdana",
              "Georgia",
              "Tahoma",
              "Calibri",
              "Garamond",
              "Bookman",
            ],

            imageGalleryData: [
              {
                src: "http://suneditor.com/docs/cat.jpg",
                name: "Tabby",
                alt: "Tabby",
                tag: "Cat",
              },
              {
                src: "http://suneditor.com/docs/cat1.jpg",
                name: "Cat paw",
                alt: "Cat paw",
                tag: "Cat",
              },
              {
                src: "http://suneditor.com/docs/cat2.jpg",
                name: "Cat",
                alt: "Cat",
                tag: "Cat",
              },
            ],
          }}
          //setContents={content}
          //setDefaultStyle="font-family: 'Arial', sans-serif; font-size: 14px;"
          setDefaultStyle="font-family: 'Arial', sans-serif; font-size: 16px; line-height: 1.5;"
          onImageUploadBefore={(files, _, uploadHandler) => {
            // console.log("files: ", files);
            // console.log("info: ", info);
            if (!files.length) {
              alert("Không có file để upload | Sai định dạng file");
              uploadHandler({
                errorMessage: "Không có file để upload | Sai định dạng file",
                result: [],
              });
              return false;
            }

            const file = files[0];
            //console.log("file: ", file);

            if (!file.type.includes("image")) {
              alert("Chỉ hỗ trợ upload ảnh");
              uploadHandler({
                errorMessage: "Chỉ hỗ trợ upload ảnh",
                result: [],
              });
              return false;
            }

            // Gọi API upload ảnh lên S3
            uploadImageS3(file)
              .then((data) => {
                uploadHandler({
                  result: [
                    {
                      url: data?.data?.data?.url,
                      name: file.name,
                      size: file.size,
                    },
                  ],
                });
                setLinkImage([data?.data?.data?.url]);
              })
              .catch((error) => {
                uploadHandler({
                  errorMessage: "Upload ảnh thất bại",
                  result: [],
                });
              });
            return true;
          }}
          onVideoUploadBefore={(files, _, uploadHandler) => {
            if (!files.length) {
              alert("Không có file để upload | Sai định dạng file");
              uploadHandler({
                errorMessage: "Không có file để upload | Sai định dạng file",
                result: [],
              });
              return false;
            }

            const file = files[0];

            if (!file.type.includes("video")) {
              alert("Chỉ hỗ trợ upload video");
              uploadHandler({
                errorMessage: "Chỉ hỗ trợ upload video",
                result: [],
              });
              return false;
            }
            //console.log("file: ", file);

            // Gọi API upload video lên S3
            uploadVideoS3(file)
              .then((data) => {
                uploadHandler({
                  result: [
                    {
                      url: data?.data?.data?.url,
                      name: file.name,
                      size: file.size,
                    },
                  ],
                });
                setLinkVideo([data?.data?.data?.url]);
              })
              .catch((error) => {
                uploadHandler({
                  errorMessage: "Upload video thất bại",
                  result: [],
                });
              });
            return true;
          }}
          // onInput={(event) => {
          //   // const htmlContent = (event.target as HTMLElement).innerHTML;
          //   // handleContentChange(htmlContent);
          // }}
          onChange={(content) => {
            //console.log("onChange content: ", content);
            handleContentChange();
          }}
          onLoad={() => {
            const editableArea =
              editorRef.current?.core?.context?.element?.wysiwyg;
            if (editableArea) {
              editableArea.addEventListener("input", handleContentChange);
            }
          }}
          getSunEditorInstance={(sunEditor) => {
            // console.log("SunEditor instance: ", sunEditor);
            editorRef.current = sunEditor;
          }}
          onImageUpload={handleImageUpload}
          lang={langOptions}
        />
      </div>
      {/* <ParseHTML html={content} /> */}
    </>
  );
};

export default forwardRef(SuneEditor);
