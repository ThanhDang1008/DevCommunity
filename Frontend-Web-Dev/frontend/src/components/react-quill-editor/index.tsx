// "use client";

// import {
//   useState,
//   useCallback,
//   useEffect,
//   useRef,
//   Ref,
//   useImperativeHandle,
//   forwardRef,
// } from "react";
// import dynamic from "next/dynamic";
// import "react-quill-new/dist/quill.snow.css";
// import "./react-quill-editor.scss";

// import { uploadImageS3, uploadVideoS3 } from "@/service/api/upload";

// const ReactQuill = dynamic(
//   async () => {
//     const { default: QuillComponent, Quill } = await import("react-quill-new");
//     const QuillResizeImageModule = await import("quill-resize-image");

//     // const Parchment = Quill.import("parchment");
//     // const lineHeightConfig = {
//     //   scope: Parchment.Scope.BLOCK,
//     //   whitelist: ["1", "1.5", "2", "2.5", "3", "4"], // Các giá trị hợp lệ
//     // };
//     // const LineHeightClass = new Parchment.ClassAttributor(
//     //   "lineHeight2",
//     //   "ql-line-height-2",
//     //   lineHeightConfig
//     // );
//     // Quill.register(LineHeightClass, true);
//     // const Font = Quill.import('formats/font') as any;
//     // Font.whitelist = [
//     //   'Arial',
//     //   'Courier New',
//     //   'Georgia',
//     //   'Lucida Sans Unicode',
//     //   'Tahoma',
//     //   'Times New Roman',
//     //   'Trebuchet MS',
//     //   'Verdana',
//     //   'Roboto',
//     // ];
//     // Quill.register(Font, true);

//     // 📌 Custom IframeBlot (Embed Video - Ví dụ: YouTube)
//     // class IframeBlot extends BlockEmbed {
//     //   static blotName = "iframe";
//     //   static tagName = "iframe";

//     //   static create(value: any) {
//     //     let node = super.create();
//     //     node.setAttribute("src", value.src);
//     //     node.setAttribute("frameborder", "0");
//     //     node.setAttribute("allowfullscreen", "true");
//     //     if (value.width) node.setAttribute("width", value.width);
//     //     if (value.height) node.setAttribute("height", value.height);
//     //     if (value.style) node.setAttribute("style", value.style);
//     //     if (value.class) node.setAttribute("class", value.class);
//     //     return node;
//     //   }

//     //   static value(node: HTMLIFrameElement) {
//     //     return {
//     //       src: node.getAttribute("src"),
//     //       width: node.getAttribute("width"),
//     //       height: node.getAttribute("height"),
//     //       style: node.getAttribute("style"),
//     //       class: node.getAttribute("class"),
//     //     };
//     //   }
//     // }
//     //Quill.register(IframeBlot, true);

//     //-------------------- Custom ImageBlot --------------------
//     const BlockEmbed: any = Quill.import("blots/block/embed");
//     class ImageBlot extends BlockEmbed {
//       static blotName = "image";
//       static tagName = "img";

//       static create(value: any) {
//         console.log("ImageBlot value", value);

//         let node = super.create();
//         node.setAttribute("src", value.src);
//         if (value.width) node.setAttribute("width", value.width);
//         if (value.height) node.setAttribute("height", value.height);
//         if (value.style) node.setAttribute("style", value.style);
//         if (value.class) node.setAttribute("class", value.class);
//         return node;
//       }

//       static value(node: HTMLImageElement) {
//         return {
//           src: node.getAttribute("src"),
//           width: node.getAttribute("width"),
//           height: node.getAttribute("height"),
//           style: node.getAttribute("style"),
//           class: node.getAttribute("class"),
//         };
//       }
//     }

//     //-------------------- Custom VideoBlot --------------------
//     // 📌 Custom VideoBlot (Sử dụng thẻ <video> thay vì <iframe>)
//     class VideoBlot extends BlockEmbed {
//       static blotName = "video";
//       static tagName = "video";

//       static create(value: any) {
//         let node = super.create();

//         console.log("VideoBlot value", value);

//         // 🔥 Kiểm tra nếu `value.src` không tồn tại
//         // if (!value || !value.src) {
//         //   console.error("VideoBlot: Giá trị `src` bị undefined!", value);
//         //   return node;
//         // }
//         node.setAttribute("src", value.src);
//         node.setAttribute("controls", "true"); // Hiển thị điều khiển
//         node.setAttribute("controlsList", "nodownload"); // Không cho tải video
//         node.setAttribute("width", value.width || "auto");
//         node.setAttribute("height", value.height || "auto");
//         node.setAttribute(
//           "style",
//           value.style || "max-width: 50%; height: auto;"
//         );
//         return node;
//       }

//       static value(node: HTMLVideoElement) {
//         return {
//           src: node.getAttribute("src"),
//           width: node.getAttribute("width"),
//           height: node.getAttribute("height"),
//           style: node.getAttribute("style"),
//         };
//       }
//     }

//     // 🚀 Đăng ký ImageBlot để ghi đè cách Quill xử lý ảnh
//     Quill.register(ImageBlot, true);
//     // 🚀 Đăng ký VideoBlot để ghi đè cách Quill xử lý video
//     Quill.register(VideoBlot, true);

//     const QuillResizeImage = QuillResizeImageModule.default;
//     //console.log("QuillResizeImage", QuillResizeImage);
//     Quill.register("modules/resizeImage", QuillResizeImage);
//     return QuillComponent;
//   },
//   { ssr: false }
// );

// type ReactQuillEditorProps = {};

// export type ReactQuillEditorRef = {
//   getHtmlContent: () => string;
//   clearHtmlContent: () => void;
//   getLink: () => {
//     image: string[];
//     video: string[];
//   };
//   clearAll: () => void;
//   clearLink: () => void;
//   setHtmlContent: (value: string) => void;
//   setLink: (value: { image: string[]; video: string[] }) => void;
// };

// const ReactQuillEditor = (
//   props: ReactQuillEditorProps,
//   ref: Ref<ReactQuillEditorRef>
// ) => {
//   const editorRef = useRef<any>(null);
//   const [htmlContent, setHtmlContent] = useState("");
//   const [linkImage, setLinkImage] = useState<string[]>([]);
//   const [linkVideo, setLinkVideo] = useState<string[]>([]);

//   const [urlImage, setUrlImage] = useState<string[]>([]);
//   const [urlVideo, setUrlVideo] = useState<string[]>([]);

//   //console.log("htmlContent", htmlContent);

//   // console.log("linkImage", linkImage);
//   // console.log("linkVideo", linkVideo);

//   // console.log("urlImage", urlImage);
//   // console.log("urlVideo", urlVideo);

//   //--------------------------- off spellcheck ----------------------------------
//   useEffect(() => {
//     if (editorRef.current) {
//       const editor = editorRef.current.getEditor();
//       if (editor) {
//         editor.root.setAttribute("spellcheck", "false");
//         editor.root.setAttribute("contenteditable", "true"); // Đảm bảo chỉnh sửa được
//       }
//       // Thêm kiểm tra lại sau khi nội dung thay đổi
//       // editor.on("text-change", () => {
//       //   editor.root.setAttribute("spellcheck", "false");
//       // });
//     }
//   }, [htmlContent]);

//   useEffect(() => {
//     setUrlImage([...urlImage, ...linkImage]);
//   }, [linkImage]);

//   useEffect(() => {
//     setUrlVideo([...urlVideo, ...linkVideo]);
//   }, [linkVideo]);

//   useImperativeHandle(ref, () => ({
//     getHtmlContent: () => htmlContent,
//     clearHtmlContent: () => setHtmlContent(""),
//     getLink: () => ({
//       image: urlImage,
//       video: urlVideo,
//     }),
//     clearLink: () => {
//       setLinkImage([]);
//       setLinkVideo([]);
//       setUrlImage([]);
//       setUrlVideo([]);
//     },
//     clearAll: () => {
//       setHtmlContent("");
//       setLinkImage([]);
//       setLinkVideo([]);
//       setUrlImage([]);
//       setUrlVideo([]);
//     },
//     setHtmlContent: (value: string) => {
//       setHtmlContent(value);
//     },
//     setLink: (value: { image: string[]; video: string[] }) => {
//       setLinkImage(value.image);
//       setLinkVideo(value.video);
//     },
//   }));

//   const imageHandler = useCallback(() => {
//     if (typeof window === "undefined" && typeof document === "undefined")
//       return;
//     const input = document.createElement("input");
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
//     input.click();
//     input.onchange = async () => {
//       // console.log(input.files);
//       if (input && input.files) {
//         const file = input.files[0];
//         //nếu là file ảnh
//         if (file.type.includes("image")) {
//           const isLt10M = file.size / 1024 / 1024 < 10;
//           if (!isLt10M) {
//             alert("Ảnh phải nhỏ hơn 10MB!");
//             return;
//           }

//           const res = await uploadImageS3(file);
//           {
//             process.env.NODE_ENV === "development" &&
//               console.log("(dev) res image: ", res.data.data.url);
//           }
//           const quill = editorRef.current;
//           if (quill) {
//             if (!res.data.data.url) {
//               alert("Upload ảnh thất bại");
//               return;
//             }
//             setLinkImage([res?.data?.data?.url]);
//             const range = quill.getEditorSelection();
//             range &&
//               quill.getEditor().insertEmbed(range.index, "image", {
//                 src: res?.data?.data?.url, // 🔥 Đảm bảo giá trị `src` hợp lệ
//                 width: "auto",
//                 height: "auto",
//                 style: "max-width: 50%; height: auto;",
//               });
//             return;
//           }
//         } else if (file.type.includes("video")) {
//           const isLt100M = file.size / 1024 / 1024 < 100;
//           if (!isLt100M) {
//             alert("Video phải nhỏ hơn 100MB!");
//             return;
//           }
//           const res = await uploadVideoS3(file);
//           {
//             process.env.NODE_ENV === "development" &&
//               console.log("(dev) res video: ", res.data.data.url);
//           }
//           const quill = editorRef.current;
//           if (quill) {
//             if (!res.data.data.url) {
//               alert("Upload video thất bại");
//               return;
//             }
//             setLinkVideo([res?.data?.data?.url]);
//             const range = quill.getEditorSelection();
//             range &&
//               quill.getEditor().insertEmbed(range.index, "video", {
//                 src: res?.data?.data?.url, // 🔥 Đảm bảo giá trị `src` hợp lệ
//                 width: "auto",
//                 height: "auto",
//                 style: "max-width: 50%; height: auto;",
//               });
//             return;
//           }
//         } else {
//           alert("Chỉ hỗ trợ tải lên ảnh hoặc video");
//         }
//       }
//     };
//   }, []);
//   const toolbarOptions = [
//     [{ header: [2, 3, 4, false] }],
//     [{ size: ["small", false, "large", "huge"] }],
//     [{ align: [] }],
//     [
//       { list: "ordered" },
//       { list: "bullet" },
//       { indent: "-1" },
//       { indent: "+1" },
//     ],
//     //thêm font chữ
//     [
//       {
//         font: [],
//       },
//     ],

//     ["bold", "italic", "underline", "strike"],

//     [
//       {
//         color: [
//           "#000000",
//           "#e60000",
//           "#ff9900",
//           "#ffff00",
//           "#008a00",
//           "#0066cc",
//           "#9933ff",
//           "#ffffff",
//           "#facccc",
//           "#ffebcc",
//           "#ffffcc",
//           "#cce8cc",
//           "#cce0f5",
//           "#ebd6ff",
//           "#bbbbbb",
//           "#f06666",
//           "#ffc266",
//           "#ffff66",
//           "#66b966",
//           "#66a3e0",
//           "#c285ff",
//           "#888888",
//           "#a10000",
//           "#cc6600",
//           "#e6e600",
//           "#006100",
//           "#0047b2",
//           "#6b24b2",
//           "#444444",
//           "#5c0000",
//           "#663d00",
//           "#999900",
//           "#003700",
//           "#002966",
//           "#3d1466",
//           "#000000",
//           "#990000",
//           "#b26b00",
//           "#b2b200",
//           "#003700",
//           "#002699",
//           "#330099",
//           "#000000",
//           "#7f0000",
//           "#994d00",
//           "#99a300",
//           "#002900",
//           "#001a66",
//           "#330066",
//           "#000000",
//           "#660000",
//           "#804000",
//           "#808000",
//           "#002100",
//           "#001a40",
//           "#1a0066",
//           "#000000",
//           "#4c0000",
//           "#663300",
//           "#666600",
//           "#001a00",
//           "#001133",
//           "#0d0040",
//         ],
//       },
//       {
//         background: [
//           "#000000",
//           "#e60000",
//           "#ff9900",
//           "#ffff00",
//           "#008a00",
//           "#0066cc",
//           "#9933ff",
//           "#ffffff",
//           "#facccc",
//           "#ffebcc",
//           "#ffffcc",
//           "#cce8cc",
//           "#cce0f5",
//           "#ebd6ff",
//           "#bbbbbb",
//           "#f06666",
//           "#ffc266",
//           "#ffff66",
//           "#66b966",
//           "#66a3e0",
//           "#c285ff",
//           "#888888",
//           "#a10000",
//           "#cc6600",
//           "#e6e600",
//           "#006100",
//           "#0047b2",
//           "#6b24b2",
//           "#444444",
//           "#5c0000",
//           "#663d00",
//           "#999900",
//           "#003700",
//           "#002966",
//           "#3d1466",
//           "#000000",
//           "#990000",
//           "#b26b00",
//           "#b2b200",
//           "#003700",
//           "#002699",
//           "#330099",
//           "#000000",
//           "#7f0000",
//           "#994d00",
//           "#99a300",
//           "#002900",
//           "#001a66",
//           "#330066",
//           "#000000",
//           "#660000",
//           "#804000",
//           "#808000",
//           "#002100",
//           "#001a40",
//           "#1a0066",
//           "#000000",
//           "#4c0000",
//           "#663300",
//           "#666600",
//           "#001a00",
//           "#001133",
//           "#0d0040",
//         ],
//       },
//     ],
//     [{ script: "sub" }, { script: "super" }],

//     ["blockquote", "code-block"],
//     // ["formula"],

//     ["link", "image", "video"],
//     ["clean"],
//     // [{ customButton: ["1", "1.5", "2", "2.5", "3", "4"] }],
//     // [{ lineHeight2: ["1", "1.5", "2", "2.5", "3", "4"] }]
//   ];

//   const modules = {
//     toolbar: {
//       container: toolbarOptions,
//       handlers: {
//         image: imageHandler,
//         video: imageHandler,
//       },
//     },

//     resizeImage: {
//       locale: {
//         // change them depending on your language
//         //  altTip: "Press alt and drag to resize image proportionally",
//         //  floatLeft: "Trái",
//         //  floatRight: "Phải",
//         //  center: "Giữa",
//         //  restore: "Phục hồi",
//         //  remove: "Xóa",
//       },
//     },
//     // sanitize: {
//     //   // Các thuộc tính cho phép
//     //   allowedAttributes: {
//     //     a: ["href", "target"],
//     //     img: ["src", "alt", "width", "height", "style", "class"],
//     //     video: ["src", "width", "height", "controls", "style", "class"],
//     //   },
//     //   // Các giá trị cho phép
//     // },
//   };
//   return (
//     <>
//       <div className="react-quill-editor">
//         <ReactQuill
//           // @ts-ignore
//           ref={editorRef}
//           theme="snow"
//           value={htmlContent}
//           //defaultValue={htmlContent}

//           onChange={setHtmlContent}
//           modules={modules}
//         />
//       </div>
//     </>
//   );
// };

// export default forwardRef(ReactQuillEditor);
// //formats={["image"]}
