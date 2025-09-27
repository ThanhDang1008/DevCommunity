"use client";

import { Modal, message, Input } from "antd";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import SelectRole from "@/modules/role/components/Select-Role";
import { queryKeys } from "@/constants/Common";
import type { SelectRoleRef } from "@/modules/role/components/Select-Role";
import { createUser } from "@/service/api/user";

type TypeModalCreateUserProps = {
  isOpen: boolean;
  title: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalCreateUser = (props: TypeModalCreateUserProps) => {
  const queryClient = useQueryClient();
  const roleRef = useRef<SelectRoleRef>(null);
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { mutate: createUserMutation, isPending: isPendingCreateUser } =
    useMutation({
      mutationFn: (data: {
        fullname: string;
        email: string;
        password: string;
        id_role: string;
      }) => createUser(data),
      onSuccess: (data) => {
        message.success("Tạo người dùng thành công");
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_ALL_USER],
        });
        props.onOk?.();
      },
      onError: (error: any) => {
        message.error(
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
        );
      },
      retry: 1, // Thử lại tối đa 3 lần nếu có lỗi
      retryDelay: 2000, // Thời gian chờ giữa các lần thử lại
    });

  const handleCreateUser = () => {
    if (!fullname || !email || !password) {
      return message.error("Vui lòng điền đầy đủ thông tin");
    }
    if (fullname.trim().length < 3 || fullname.trim().length > 50) {
      return message.error("Tên người dùng phải từ 3 đến 50 ký tự");
    }
    if (!email.includes("@") || !email.includes(".")) {
      return message.error("Email không hợp lệ");
    }
    if (
      !roleRef?.current?.getSelectedRole()?.value ||
      roleRef?.current?.getSelectedRole()?.value === ""
    ) {
      return message.error("Vui lòng chọn vai trò");
    }
    if (password.length < 6 || password.length > 50) {
      return message.error("Mật khẩu phải từ 6 đến 50 ký tự");
    }

    console.log("roleRef", roleRef?.current?.getSelectedRole()?.value);

    createUserMutation({
      fullname: fullname.trim(),
      email: email.trim(),
      password: password.trim(),
      id_role: roleRef?.current?.getSelectedRole()?.value || "",
    });
  };

  return (
    <Modal
      title={
        <>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">{props.title}</span>
          </div>
        </>
      }
      open={props.isOpen || false}
      onOk={() => {
        handleCreateUser();
      }}
      onCancel={() => props.onCancel?.()}
      okText={"Tạo"}
      cancelText="Đóng"
      okType="primary"
      confirmLoading={isPendingCreateUser}
      //cancelButtonProps={{ style: { display: "none" } }}
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Tên người dùng
        <span className="text-red-500">*</span>
      </label>
      <Input
        placeholder="Nhập tên người dùng"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
      />
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">
        Email
        <span className="text-red-500">*</span>
      </label>
      <Input
        placeholder="Nhập email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">
        Vai trò
        <span className="text-red-500">*</span>
      </label>
      <SelectRole ref={roleRef} />
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">
        Mật khẩu
        <span className="text-red-500">*</span>
      </label>
      <Input.Password
        placeholder="Nhập mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Modal>
  );
};

export { ModalCreateUser };
