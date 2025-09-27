import { Spin } from "antd";
import clsx from "clsx";

function LoadingGlobal() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spin size="large" />
    </div>
  );
}
export default LoadingGlobal;