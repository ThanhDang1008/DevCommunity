// import "./parse-html.scss";
// import parse, { DOMNode } from "html-react-parser";
// import VideoPlayer from "@components/video-player";

// interface ParseHTMLProps {
//   html: string | undefined;
// }

// const ParseHTML = (props: ParseHTMLProps) => {
//   return (
//     <>
//       <div className="parse-html">
//         <div className="ql-snow">
//           <div className="ql-editor">
//             {/* <div dangerouslySetInnerHTML={{ __html: postContent }} /> */}
//             <div>
//               {parse(props.html || "", {
//                 transform(reactNode: any, domNode: DOMNode, index: number) {
//                   //lấy ra đường dẫn trong thẻ video
//                   //@ts-ignore
//                   // if (domNode?.name === "iframe") {
//                   //   //@ts-ignore
//                   //   const src = domNode?.attribs?.src;
//                   //   //@ts-ignore
//                   //   const style = domNode?.attribs?.style;
//                   //   const styleObject = style
//                   //     ? style.split(";").reduce((acc: any, style: any) => {
//                   //         const [key, value] = style.split(":");
//                   //         if (key && value) {
//                   //           acc[key.trim()] = value.trim();
//                   //         }
//                   //         return acc;
//                   //       }, {})
//                   //     : {};

//                   //   // console.log("transform style: ", styleObject);
//                   //   // console.log("transform style: ", style);
//                   //   return (
//                   //     <VideoPlayer style={styleObject} src={src} key={index} />
//                   //   );
//                   // }
//                   //nếu nội dung thẻ p là http thì sẽ render ra thẻ a
//                   //@ts-ignore
//                   // if (domNode?.name === "p") {
//                   //   //@ts-ignore
//                   //   const src = domNode?.children[0]?.data;
//                   //   if (
//                   //     src &&
//                   //     src.includes("https") &&
//                   //     src.includes("http") &&
//                   //     src.includes("www")
//                   //   ) {
//                   //     const parts = src.split(" ");
//                   //     return (
//                   //       <p key={index}>
//                   //         {parts.map((part: any, i: any) =>
//                   //           part.includes("https") ? (
//                   //             <a href={part} key={i}>
//                   //               {part}
//                   //             </a>
//                   //           ) : (
//                   //             `${part} `
//                   //           )
//                   //         )}
//                   //       </p>
//                   //     );
//                   //   }
//                   // }
//                   return reactNode;
//                 },
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ParseHTML;
