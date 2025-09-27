import {
  forwardRef,
  useImperativeHandle,
  Ref,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Select } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/Common";
import { getAllRole } from "@/service/api/role";

export type SelectRoleRef = {
  getSelectedRole: () => { value: string; label: string | "" } | null;
  clearSelectedRole: () => void;
  setSelectedRole: (value: string) => void;
};

type SelectRoleProps = {
  selectedRole?: { value: string };
  disabled?: boolean;
};

const SelectRole = (props: SelectRoleProps, ref: Ref<SelectRoleRef>) => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });
  //console.log("selectedRole", selectedRole);

  useImperativeHandle(ref, () => ({
    getSelectedRole: () => {
      if (!selectedRole.value) {
        return null;
      }
      return selectedRole;
    },
    clearSelectedRole: () => {
      setSelectedRole({ value: "", label: "" });
    },
    setSelectedRole: (value: string) => {
      setSelectedRole({
        ...selectedRole,
        value: value,
      });
    },
  }));

  const {
    data: data_roles,
    isLoading: isLoading_roles,
    isError: isError_roles,
    error: error_roles,
  } = useQuery({
    queryKey: [queryKeys.GET_ALL_ROLE],
    queryFn: () => getAllRole(),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  useEffect(() => {
    if (props.selectedRole?.value) {
      setSelectedRole({
        ...selectedRole,
        value: props.selectedRole.value,
      });
    }
  }, [props.selectedRole]);

  //console.log("data_roles", data_roles);

  const SelectOptionsRole = useMemo(() => {
    if (!data_roles?.data?.data) return [];
    return data_roles?.data?.data.map((role) => ({
      value: role._id,
      label: role.role,
    }));
  }, [data_roles]);

  const onChange = (
    value: string,
    option: { value: string; label: string }
  ) => {
    setSelectedRole({
      value: option.value,
      label: option.label,
    });
    // Call the onChange prop if it exists
  };

  return (
    <>
      <Select
        disabled={props.disabled}
        showSearch
        style={{ width: 200 }}
        placeholder="Chọn vai trò"
        optionFilterProp="label"
        notFoundContent={
          <>
            {isLoading_roles && (
              <p className="italic text-gray-500 text-center">
                Đang tải dữ liệu...
              </p>
            )}
            {isError_roles && (
              <div className="flex justify-center">
                <button
                  className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: [queryKeys.GET_All_TAG],
                    }); //invalidate cache
                  }}
                >
                  <i className="bi bi-exclamation-triangle"></i> Đã có lỗi xảy
                  ra, nhấn để thử lại
                </button>
              </div>
            )}
          </>
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        onChange={(value, option) => {
          return onChange(value, option as { value: string; label: string });
        }}
        options={[
          //{ value: "", label: "❌ Bỏ chọn" },
          ...(SelectOptionsRole || []),
        ]}
        value={selectedRole.value || "Chọn vai trò"}
      />
    </>
  );
};

export default forwardRef(SelectRole);
