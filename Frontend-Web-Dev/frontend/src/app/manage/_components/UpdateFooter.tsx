"use client";

import { message, Button, Modal } from "antd";
import { useState, useRef } from "react";
import Link from "next/link";

import SuneEditor, { SuneEditorRef } from "@components/suneditor";
import { tagNext } from "@/constants/Common";
import ParseHTML from "@components/suneditor/parse";

import { updateDataWeb, readDataWeb } from "@/service/api/web";
import { revalidateTag } from "@/service/api/web/actions";

const UpdateFooter = () => {
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const [isLoadingGetData, setIsLoadingGetData] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const sunEditorRef = useRef<SuneEditorRef>(null);

  const updateFooter = async () => {
    // console.log("newValue: ", newValue);
    const content = sunEditorRef.current?.getHtmlContent();
    // console.log("content: ", content);
    if (!content) {
      return message.open({
        type: "warning",
        content: "Vui lòng nhập nội dung",
      });
    }
    setIsLoadingUpdate(true);
    try {
      const response = await updateDataWeb({
        footer: {
          content: content,
        },
      });
      if (response?.status === 200) {
        //gọi qua server ko throw chi tiết error
        const res = await revalidateTag(tagNext.WEB).catch((error) => {
          setIsLoadingUpdate(false);
          return message.open({
            type: "error",
            content: "Cập nhật thất bại",
          });
        });
        //console.log("___res: ", res);
        if (res?.status === 200) {
          setIsLoadingUpdate(false);
          handleClear();
          return message.open({
            type: "success",
            content: "Cập nhật thành công",
          });
        }
      }
    } catch (error) {
      //console.log("___error: ", error);
      setIsLoadingUpdate(false);
      return message.open({
        type: "error",
        content: "Cập nhật thất bại",
      });
    }
  };

  const handleClear = () => {
    sunEditorRef?.current?.clearAll();
  };

  const getData = async () => {
    setIsLoadingGetData(true);

    const response = await readDataWeb()
    if (response?.status === 200) {
      // console.log("response: ", response.data?.footer?.content);
      sunEditorRef.current?.setHtmlContent(
        response.data?.data?.footer?.content || ""
      );
    } else {
      message.open({
        type: "error",
        content: "Lấy dữ liệu thất bại",
      });
    }
    setIsLoadingGetData(false);

    return response;
  };

  return (
    <>
      <div className="">
        <div className="">
          <SuneEditor ref={sunEditorRef} />
        </div>
        <div className="mt-3 flex gap-3">
          <Button
            type="primary"
            loading={isLoadingUpdate}
            onClick={() => {
              updateFooter();
            }}
          >
            {isLoadingUpdate ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
          <Button
            type="default"
            onClick={() => getData()}
            className="ml-2"
            loading={isLoadingGetData}
          >
            <i className="bi bi-cloud-download"></i>
            {isLoadingGetData ? "Đang tải..." : "Lấy dữ liệu"}
          </Button>
          <Button
            type="default"
            onClick={() => {
              setOpen(true);
            }}
          >
            Xem trước
          </Button>
        </div>
      </div>
      <Modal
        title="Xem trước nội dung chân trang"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        okText="Đóng"
        cancelButtonProps={{
          style: { display: "none" },
        }}
        okType="default"
        width={{
          xs: "100%",
          sm: "100%",
          md: "100%",
          lg: "100%",
          xl: "100%",
          xxl: "100%",
        }}
      >
        <div className="w-full bg-[#2fa1b3] py-3 px-4 flex justify-center items-center">
          <div className="max-w-screen-xl w-full flex justify-between items-center">
            <div className="text-2xl font-bold">
              <Link href="/" className="text-white">
                VNEWS 247
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full bg-white py-2 px-4">
          {/* Categories */}
          <div className="">
            <div className="max-w-screen-xl mx-auto text-sm text-gray-600 flex flex-wrap">
              {/* Row 1 */}
              {/* {topCategories.map((category, index) => {
                return (
                  <Fragment key={index}>
                    {index > 0 && <span className="text-gray-300 mx-1">·</span>}
                    <Link
                      title={category.title}
                      href={`/chu-de${category.value}`}
                      className="hover:text-teal-600 mb-2"
                    >
                      {category.title}
                    </Link>
                    {category.children && category.children.length > 0 && (
                      <Fragment>
                        {category.children.map((child, childIndex) => {
                          // if (childIndex >= totalItemRender) return null;
                          return (
                            <Fragment key={childIndex}>
                              <span className="text-gray-300 mx-1">·</span>
                              <Link
                                title={child.title}
                                href={`/chu-de${category.value}${child.value}`}
                                className="hover:text-teal-600 mb-2"
                              >
                                {child.title}
                              </Link>
                            </Fragment>
                          );
                        })}
                      </Fragment>
                    )}
                  </Fragment>
                );
              })} */}
            </div>
          </div>
          {/* Footer Info */}
          <div className="text-gray-600 mt-4">
            <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row">
              <ParseHTML html={sunEditorRef.current?.getHtmlContent()} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateFooter;
