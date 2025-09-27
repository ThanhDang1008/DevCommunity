// "use client";

// import { useState } from "react";
// import { Button, Drawer, Collapse } from "antd";
// import { CaretRightOutlined } from "@ant-design/icons";
// import Link from "next/link";
// import { usePathname } from "next/navigation";


// type ItemChildCategory = {
//   title: string;
//   value: string;
// };

// type MainCategory = {
//   title: string;
//   value: string;
//   children?: ItemChildCategory[];
// };

// type HeaderDrawerProps = {
//   items: MainCategory[];
// };

// const HeaderDrawer = (props: HeaderDrawerProps) => {
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname();

//   const showDrawer = () => {
//     setOpen(true);
//   };

//   const onClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <div className="nav-toggle">
//         <div
//           title="Quay lại"
//           className="nav-toggle-bar"
//           onClick={() => window.history.back()}
//         >
//           <i className="bi bi-arrow-return-left"></i>
//         </div>

//         {pathname !== "/" && (
//           <div title="Trang chủ" className="nav-toggle-bar">
//             <Link title="Trang chủ" href="/" className="">
//               {""}
//               <i className="bi bi-house"></i>
//             </Link>
//           </div>
//         )}
//         <div title="Danh mục" className="nav-toggle-bar" onClick={showDrawer}>
//           <i className="bi bi-list"></i>
//         </div>
//       </div>

//       <Drawer
//         className="site-header-drawer"
//         title="Danh mục"
//         onClose={onClose}
//         open={open}
//         placement="left"
//       >
//         <div>
//           {props.items.map((item, index) => {
//             return (
//               <div key={index}>
//                 <Collapse
//                   bordered={false}
//                   expandIcon={({ isActive }) => {
//                     if (!item.children || item.children?.length === 0) {
//                       return null;
//                     }
//                     return (
//                       <CaretRightOutlined
//                         style={{ color: "#ffffff" }}
//                         rotate={isActive ? 90 : 180}
//                       />
//                     );
//                   }}
//                   items={[
//                     {
//                       label: (
//                         <Link
//                           title={item.title}
//                           href={`/chu-de${item.value}`}
//                           className="title-header-drawer"
//                         >
//                           {item.title}
//                         </Link>
//                       ),
//                       children: (
//                         <>
//                           {item.children?.map((child, childIndex) => {
//                             return (
//                               // <Button
//                               //   key={childIndex}
//                               //   type="text"
//                               //   onClick={() => {
//                               //     //router.push("/account");
//                               //   }}
//                               //   style={{
//                               //     width: "100%",
//                               //     marginBottom: "5px",
//                               //   }}
//                               // >
//                               //   {child.title}
//                               // </Button>
//                               <Link
//                                 key={childIndex}
//                                 title={child.title}
//                                 href={`/chu-de${item.value}${child.value}`}
//                                 className="title-header-drawer-child"
//                               >
//                                 {child.title}
//                               </Link>
//                             );
//                           })}
//                         </>
//                       ),
//                     },
//                   ]}
//                 />
//               </div>
//             );
//           })}
//         </div>
//         <div
//           style={{
//             marginTop: "20px",
//             marginBottom: "10px",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <div className="search-container">
//             <button className="search-button">
//               <svg className="search-icon" viewBox="0 0 24 24">
//                 <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
//               </svg>
//             </button>
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Tìm kiếm..."
//               spellCheck="false"
//             />
//           </div>
//         </div>
//         <div className="drawer-footer">
//           <button
//             className="close-button"
//             onClick={() => {
//               setOpen(false);
//             }}
//           >
//             Đóng
//           </button>
//         </div>
//       </Drawer>
//     </>
//   );
// };

// export default HeaderDrawer;
