"use client";

import type { TableProps } from "antd";
import {
  Space,
  Table,
  Tag,
  Image,
  Drawer,
  Form,
  Input,
  Button,
  message,
} from "antd";
import { useState, useMemo, useRef, useEffect } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { DataSetInfoUser } from "@/service/api/user/types";
import type { DefaultAuthProvider } from "@components/auth/auth.provider";
import type { SelectRoleRef } from "@/modules/role/components/Select-Role";
import type { SelectStatusRef } from "@/modules/user/components/Select-Status";
import { getAllUsers, setInfoUser } from "@/service/api/user";
import { queryKeys } from "@/constants/Common";
import { useGetInfoUser } from "@modules/user/hooks";
import SelectRole from "@/modules/role/components/Select-Role";
import SelectStatus from "@/modules/user/components/Select-Status";

import { ModalCreateUser } from "@/modules/user/components/modal/ModalCreateUser";
import { ModalDeleteUser } from "@/modules/user/components/modal/ModalDeleteUser";

export interface DataType {
  key: string;
  avatar: string;
  fullname: string;
  email: string;
  role: DefaultAuthProvider["listRole"];
  id_role: string;
  status: string;
  type: string;
}

const DrawerUserDetail = ({ user }: { user: DataType | null }) => {
  const queryClient = useQueryClient();
  type FormValues = {
    fullname: string;
    email: string;
    avatar: string;
    password?: string;
  };

  const roleRef = useRef<SelectRoleRef>(null);
  const statusRef = useRef<SelectStatusRef>(null);
  const [isUpate, setIsUpdate] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [form] = Form.useForm();

  const { mutate: updateInfoUserMutation, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: (data: DataSetInfoUser) => setInfoUser(data),
      onSuccess: (data) => {
        message.open({
          type: "success",
          content: "Cập nhật thành công",
        });

        setIsUpdate(false);
        form.resetFields();
        //Invalidate the query to refetch data
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === queryKeys.GET_ALL_USER,
        });
      },
      onError: (error: any) => {
        message.open({
          type: "error",
          content:
            error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
          duration: 3,
        });
      },
      retry: 3,
      retryDelay: 2000,
    });

  const onFinish = (values: FormValues) => {
    if (!user) {
      message.open({
        type: "error",
        content: "Đã có lỗi xảy ra, vui lòng thử lại sau",
      });
      return;
    }

    // Ensure all required fields are present and non-undefined
    const selectedRole =
      roleRef.current?.getSelectedRole()?.value ?? user.id_role;
    const selectedStatus =
      statusRef.current?.getSelectedStatus()?.value ?? user.status;

    let dataUpdate: DataSetInfoUser = {
      id_user: user.key,
      fullname: values.fullname,
      email: values.email,
      id_role: selectedRole,
      status: selectedStatus,
    };
    if (values.avatar) dataUpdate["avatar"] = values.avatar;
    if (values.password) dataUpdate["password"] = values.password;

    //console.log("dataUpdate", dataUpdate);

    updateInfoUserMutation(dataUpdate);
  };

  const onFinishFailed = (errorInfo: any) => {
    //console.log("Failed:", errorInfo);
    alert("Vui lòng nhập đầy đủ & đúng thông tin");
  };
  return (
    <>
      <button
        className={clsx(
          "text-blue-500 hover:text-blue-700 bg-blue-100 px-2 py-1 rounded",
          "dark:bg-blue-800 dark:text-blue-300 dark:hover:text-blue-400 dark:hover:bg-blue-700"
        )}
        onClick={() => {
          setShowDrawer(true);
        }}
      >
        <i className="bi bi-eye-fill"></i> Chi tiết
      </button>

      <Drawer
        title="Chi tiết người dùng"
        placement="right"
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        width={400}
      >
        {user ? (
          <>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                avatar: user.avatar,
                fullname: user.fullname,
                email: user.email,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              spellCheck="false"
            >
              <Form.Item label="Ảnh đại diện" name="avatar">
                <Image
                  src={user.avatar}
                  alt="Ảnh đại diện"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border"
                  fallback="/image/thumbnail_default.jpg"
                />
              </Form.Item>
              <Form.Item
                label="Tên đầy đủ"
                name="fullname"
                rules={[
                  { required: true, message: "Vui lòng nhập tên" },
                  { min: 3, message: "Tên quá ngắn" },
                  { max: 50, message: "Tên quá dài" },
                ]}
              >
                <Input disabled={!isUpate} />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input disabled={!isUpate} />
              </Form.Item>
              <Form.Item
                label="Đặt lại mật khẩu"
                name="password"
                rules={[
                  {
                    min: 6,
                    message: "Mật khẩu phải tối thiểu 6 ký tự",
                  },
                  {
                    max: 100,
                    message: "Mật khẩu tối đa 100 ký tự",
                  },
                ]}
              >
                <Input.Password disabled={!isUpate} />
              </Form.Item>
              <Form.Item label="Vai trò" name="role">
                <SelectRole
                  ref={roleRef}
                  selectedRole={{
                    value: user.id_role,
                  }}
                  disabled={!isUpate}
                />
              </Form.Item>
              <Form.Item label="Trạng thái" name="status">
                <SelectStatus
                  ref={statusRef}
                  selectedStatus={{
                    value: user.status,
                  }}
                  disabled={!isUpate}
                />
              </Form.Item>

              {/* Submit */}
              <Form.Item>
                <Button
                  className="mb-2 md:mr-2 w-full md:w-auto"
                  type="default"
                  onClick={() => {
                    setIsUpdate(!isUpate);
                    // form.resetFields();
                  }}
                >
                  {isUpate ? "Hủy" : "Sửa thông tin"}
                </Button>
                <Button
                  disabled={!isUpate || isPendingUpdate}
                  className="w-full md:w-auto"
                  type="primary"
                  htmlType="submit"
                >
                  {isPendingUpdate ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <p>Không có thông tin người dùng.</p>
        )}
      </Drawer>
    </>
  );
};

const BtnDeleteUser = ({ record }: { record: DataType }) => {
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const { data: infoUser } = useGetInfoUser();
  return (
    <>
      <button
        className={clsx(
          "text-red-500 hover:text-red-700 bg-red-100 px-2 py-1 rounded",
          "dark:bg-red-800 dark:text-red-300 dark:hover:text-red-400 dark:hover:bg-red-700"
        )}
        onClick={() => {
          if (infoUser?._id === record.key) {
            message.error("Bạn không thể xoá chính mình.");
            return;
          }
          setIsOpenModalDelete(true);
        }}
      >
        Xoá
      </button>
      {isOpenModalDelete && (
        <ModalDeleteUser
          isOpen={isOpenModalDelete}
          title="Xoá người dùng"
          userRecord={record}
          onOk={() => {
            setIsOpenModalDelete(false);
          }}
          onCancel={() => setIsOpenModalDelete(false)}
        />
      )}
    </>
  );
};

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Ảnh đại diện",
    dataIndex: "avatar",
    key: "avatar",
    render: (text) => (
      <Image
        src={text}
        alt="avatar"
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          border: "2px solid #d9d9d9",
        }}
        fallback="/image/thumbnail_default.jpg"
      />
    ),
    width: "10%",
    align: "center",
  },
  {
    title: "Tên",
    dataIndex: "fullname",
    key: "fullname",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    key: "role",
    render: (_, { role }) => {
      let color = "green";
      //"ROOT" | "ADMIN" | "USER" | "GUEST" | "DEV"
      if (role === "ROOT") {
        color = "purple";
      } else if (role === "ADMIN") {
        color = "volcano";
      } else if (role === "USER") {
        color = "blue";
      } else if (role === "GUEST") {
        color = "orange";
      } else if (role === "DEV") {
        color = "cyan";
      }
      return (
        <>
          <Tag color={color}>{role}</Tag>
        </>
      );
    },
  },
  {
    title: "Trạng thái",
    key: "status",
    dataIndex: "status",
    render: (_, { status }) => {
      let color = "default";
      if (status === "VERIFIED") {
        color = "green";
      } else if (status === "UNVERIFIED") {
        color = "red";
      } else if (status === "BANNED") {
        color = "volcano";
      } else if (status === "PENDING") {
        color = "orange";
      } else if (status === "SUSPENDED") {
        color = "blue";
      }
      return (
        <>
          <Tag color={color} className="capitalize">
            {status.toUpperCase()}
          </Tag>
        </>
      );
    },
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <DrawerUserDetail user={record} />
        <BtnDeleteUser record={record} />
      </Space>
    ),
  },
];

const ListUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: infoUser } = useGetInfoUser();
  const [isOpenModalCreateUser, setIsOpenModalCreateUser] = useState(false);

  const PAGE_USER = 1;
  const LIMIT_USER = 10;

  const queryPage =
    searchParams.get("p") && !isNaN(Number(searchParams.get("p")))
      ? Number(searchParams.get("p"))
      : PAGE_USER;
  const queryLimit =
    searchParams.get("l") && !isNaN(Number(searchParams.get("l")))
      ? Number(searchParams.get("l"))
      : LIMIT_USER;

  const [_page, setPage] = useState(queryPage);
  const [_limit, setLimit] = useState(queryLimit);

  const updateQuery = (newParams: { [key: string]: string | null }) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, {
      scroll: false, // scroll to top
    });
  };

  const {
    data: listUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_ALL_USER, _page, _limit],
    queryFn: () => getAllUsers(_page, _limit),
    gcTime: 1000 * 60 * 10, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const dataUsers: DataType[] = useMemo(() => {
    if (!listUser || !listUser.data || !listUser.data.data) return [];

    return listUser.data.data.map((user) => ({
      key: user._id,
      avatar: user.avatar || "/image/thumbnail_default.jpg",
      fullname:
        infoUser?._id === user._id ? `${user.fullname} (Bạn)` : user.fullname,
      email: user.email,
      role: user.id_role.role as DefaultAuthProvider["listRole"],
      id_role: user.id_role._id,
      status: user.status,
      type: user.type,
      permissions: user.permissions || [],
    }));
  }, [listUser]);

  //console.log("listUser", listUser);
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        {
          <Button type="primary" onClick={() => setIsOpenModalCreateUser(true)}>
            <i className="bi bi-plus-lg"></i> Tạo người dùng
          </Button>
        }
      </div>
      <Table<DataType>
        rowClassName={(record) => {
          return record.role === "ROOT" ? "bg-zinc-100 dark:bg-zinc-800" : "";
        }}
        columns={columns}
        dataSource={dataUsers}
        scroll={{ x: "max-content" }}
        locale={{
          emptyText: isLoading
            ? "Đang tải dữ liệu..."
            : isError
            ? `Có lỗi xảy ra: ${error?.message || "Vui lòng thử lại"}`
            : "Không có dữ liệu",
        }}
        loading={isLoading}
        rowKey={(record) => record.key}
        //bordered
        pagination={
          dataUsers.length > 0
            ? {
                position: ["bottomCenter"],
                pageSizeOptions: ["2", "5", "10", "20"],
                showSizeChanger: true,
                showQuickJumper: false,
                defaultPageSize: Number(_limit),
                defaultCurrent: Number(_page),
                current: Number(_page),
                total: listUser?.data?.totalUsers || 0,
                onChange: (page, pageSize) => {
                  setPage(page);
                  setLimit(pageSize);
                  updateQuery({
                    p: page.toString(),
                    l: pageSize.toString(),
                  });
                  // //scroll to top
                  // window.scrollTo({ top: 0, behavior: "smooth" });
                },
              }
            : false
        }
      />
      {isOpenModalCreateUser && (
        <ModalCreateUser
          isOpen={isOpenModalCreateUser}
          title="Tạo người dùng mới"
          onOk={() => {
            setIsOpenModalCreateUser(false);
            // Handle create user logic here
          }}
          onCancel={() => setIsOpenModalCreateUser(false)}
        />
      )}
    </>
  );
};

export default ListUser;
