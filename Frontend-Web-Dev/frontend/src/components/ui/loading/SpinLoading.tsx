import { Spin } from "antd";
import clsx from "clsx";

function SpinLoading() {
  return (
    <div
      className={clsx(
        "flex justify-center items-center h-screen",
        "custom-bg-light-container dark:custom-bg-dark-container"
      )}
    >
      <Spin size="large" />
    </div>
  );
}
export default SpinLoading;
