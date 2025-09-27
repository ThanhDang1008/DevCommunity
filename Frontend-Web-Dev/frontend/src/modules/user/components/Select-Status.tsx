import {
  forwardRef,
  useImperativeHandle,
  Ref,
  useState,
  useEffect,
} from "react";
import { Select } from "antd";

export type SelectStatusRef = {
  getSelectedStatus: () => { value: string; label: string } | null;
  clearSelectedStatus: () => void;
};

type SelectStatusProps = {
  selectedStatus?: { value: string };
  disabled?: boolean;
};

const SelectStatus = (props: SelectStatusProps, ref: Ref<SelectStatusRef>) => {
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });
  //console.log("selectedRole", selectedRole);

  useImperativeHandle(ref, () => ({
    getSelectedStatus: () => {
      if (!selectedStatus.value) {
        return null;
      }
      return selectedStatus;
    },
    clearSelectedStatus: () => {
      setSelectedStatus({ value: "", label: "" });
    },
  }));

  useEffect(() => {
    if (props.selectedStatus?.value) {
      setSelectedStatus({
        ...selectedStatus,
        value: props.selectedStatus.value,
      });
    }
  }, [props.selectedStatus]);

  const onChange = (
    value: string,
    option: { value: string; label: string }
  ) => {
    setSelectedStatus({
      value: value,
      label: option.label,
    });
  };

  return (
    <>
      <Select
        disabled={props.disabled}
        showSearch
        style={{ width: 200 }}
        placeholder="Chọn trạng thái"
        optionFilterProp="label"
        // notFoundContent={
        //   <>
        //     {isLoading && (
        //       <p className="italic text-gray-500 text-center">
        //         Đang tải dữ liệu...
        //       </p>
        //     )}
        //     {isError && (
        //       <div className="flex justify-center">
        //         <button
        //           className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg"
        //           onClick={() => {
        //             queryClient.invalidateQueries({
        //               queryKey: [queryKeys.GET_All_TAG],
        //             }); //invalidate cache
        //           }}
        //         >
        //           <i className="bi bi-exclamation-triangle"></i> Đã có lỗi xảy
        //           ra, nhấn để thử lại
        //         </button>
        //       </div>
        //     )}
        //   </>
        // }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        onChange={(value, option) => {
          return onChange(value, option as { value: string; label: string });
        }}
        options={[
          { value: "VERIFIED", label: "Đã xác minh ✅" },
          { value: "UNVERIFIED", label: "Chưa xác minh ❌" },
          { value: "BANNED", label: "Khóa tài khoản 🚫" },
          { value: "PENDING", label: "Đang chờ xử lý ⏳" },
          { value: "SUSPENDED", label: "Tạm ngưng ⏸️" },
        ]}
        value={selectedStatus.value || "Chọn trạng thái"}
      />
    </>
  );
};

export default forwardRef(SelectStatus);
