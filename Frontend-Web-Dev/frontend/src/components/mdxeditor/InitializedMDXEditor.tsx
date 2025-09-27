// "use client";
// // InitializedMDXEditor.tsx
// import type { ForwardedRef } from "react";
// import { useState } from "react";
// import {
//   headingsPlugin,
//   listsPlugin,
//   quotePlugin,
//   thematicBreakPlugin,
//   markdownShortcutPlugin,
//   MDXEditor,
//   UndoRedo,
//   BoldItalicUnderlineToggles,
//   toolbarPlugin,
//   linkPlugin,
//   linkDialogPlugin,
//   imagePlugin,
//   tablePlugin,
//   frontmatterPlugin,
//   codeBlockPlugin,
//   sandpackPlugin,
//   codeMirrorPlugin,
//   directivesPlugin,
//   diffSourcePlugin,
//   BlockTypeSelect,
//   CodeToggle,
//   CreateLink,
//   DiffSourceToggleWrapper,
//   InsertAdmonition,
//   InsertCodeBlock,
//   InsertFrontmatter,
//   InsertTable,
//   InsertImage,
//   InsertSandpack,
//   InsertThematicBreak,
//   ListsToggle,
//   ShowSandpackInfo,
//   ChangeAdmonitionType,
//   ChangeCodeMirrorLanguage,
//   type MDXEditorMethods,
//   type MDXEditorProps,
// } from "@mdxeditor/editor";

// import "@mdxeditor/editor/style.css";

// // Only import this to the next file
// export default function InitializedMDXEditor({
//   editorRef,
//   ...props
// }: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
//   const [markdown, setMarkdown] = useState<string>("# Hello world");
//   return (
//     <MDXEditor
//       plugins={[
//         toolbarPlugin({
//           toolbarClassName: "my-classname",
//           toolbarContents: () => (
//             <>
//               <UndoRedo />
//               <BoldItalicUnderlineToggles />
//               <BlockTypeSelect />
//               <ListsToggle />
//               <InsertThematicBreak />
//               <InsertAdmonition />
//               <InsertCodeBlock />
//               <InsertFrontmatter />
//               <InsertTable />
//               <InsertImage />
//             </>
//           ),
//         }),
//       ]}
//       spellCheck={false}
//       {...props}
//       ref={editorRef}
//       onChange={(value) => {
//         setMarkdown(value);
//       }}
//       suppressHtmlProcessing={true}
//     />
//   );
// }
