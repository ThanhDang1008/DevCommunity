"use client";

import { useState } from "react";
import ModalUpdateChildTag from "./ModalUpdateChildTag";
import ModalDeleteChildTag from "./ModalDeleteChildTag";

type ModalChildTagProps = {
  tag_id: string;
  child_tag_id: string;
  description: string;
  name: string;
  slug: string;
  child_slug: string;
};

const ChildTag = (props: ModalChildTagProps) => {
  const [isOpenModalUpdateChildTag, setIsOpenModalUpdateChildTag] =
    useState<boolean>(false);
  const [isOpenModalDeleteChildTag, setIsOpenModalDeleteChildTag] =
    useState<boolean>(false);
  return (
    <>
      <div className="flex flex-col gap-2">
        <div>
          <p className="font-semibold">Mô tả:</p>
          {props.description ? (
            <p>{props.description}</p>
          ) : (
            <p>(chưa có mô tả)</p>
          )}
        </div>

        <div className="flex sm:flex-row gap-2 flex-col mt-2">
          <button
            type="button"
            //tailwindcss
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 py-2 px-4 rounded"
            onClick={() => {
              setIsOpenModalUpdateChildTag(true);
            }}
          >
             <i className="bi bi-pencil-square"></i>
          </button>

          <button
            type="button"
            //tailwindcss
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
            onClick={() => {
              setIsOpenModalDeleteChildTag(true);
            }}
          >
              <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
      {isOpenModalUpdateChildTag && (
        <ModalUpdateChildTag
          isOpen={isOpenModalUpdateChildTag}
          onClose={() => {
            setIsOpenModalUpdateChildTag(false);
          }}
          tag_id={props.tag_id}
          child_tag_id={props.child_tag_id}
          name={props.name}
        />
      )}

      <ModalDeleteChildTag
        isOpen={isOpenModalDeleteChildTag}
        onClose={() => {
          setIsOpenModalDeleteChildTag(false);
        }}
        tag_id={props.tag_id}
        child_tag_id={props.child_tag_id}
        name={props.name}
        slug={props.slug}
        child_slug={props.child_slug}
      />
    </>
  );
};

export default ChildTag;
