"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";

import type { DefaultAuthProvider } from "./auth.provider";
import { useAuthContext } from "./auth.provider";

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decoration */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div> */}

      <div className="relative z-10 max-w-md w-full">
        {/* Main card */}
        <div
          className={clsx(
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl",
            "border border-white/20 dark:border-gray-700/50 p-8 text-center",
            "transform hover:scale-[1.02] transition-all duration-300"
          )}
        >
          {/* Icon with animation */}
          <div className="mb-6 flex justify-center">
            <div
              className={clsx(
                "w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600",
                "flex items-center justify-center shadow-lg",
                "animate-pulse"
              )}
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222 5.636 5.636 10.586 10.586 5.636 15.536l1.414 1.414L12 12.828l4.95 4.95 1.414-1.414-4.95-4.95z"
                />
              </svg>
            </div>
          </div>

          {/* Error code with gradient */}
          <div className="mb-4">
            <h1
              className={clsx(
                "text-8xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-purple-600",
                "bg-clip-text text-transparent drop-shadow-sm"
              )}
            >
              403
            </h1>
          </div>

          {/* Title */}
          <h2
            className={clsx(
              "text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100"
            )}
          >
            Truy Cập Bị Từ Chối
          </h2>

          {/* Description */}
          <p
            className={clsx(
              "text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
            )}
          >
            Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng liên hệ
            quản trị viên nếu bạn cho rằng đây là lỗi.
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className={clsx(
                "group w-full inline-flex items-center justify-center gap-2 px-6 py-3",
                "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                "text-white font-semibold rounded-xl shadow-lg hover:shadow-xl",
                "transform hover:-translate-y-0.5 transition-all duration-200",
                "focus:outline-none focus:ring-4 focus:ring-blue-500/25"
              )}
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Về Trang Chủ
            </Link>

            <button
              onClick={() => window.history.back()}
              className={clsx(
                "group w-full inline-flex items-center justify-center gap-2 px-6 py-3",
                "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
                "text-gray-700 dark:text-gray-300 font-medium rounded-xl",
                "border border-gray-200 dark:border-gray-600",
                "transform hover:-translate-y-0.5 transition-all duration-200",
                "focus:outline-none focus:ring-4 focus:ring-gray-500/25"
              )}
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay Lại
            </button>
          </div>
        </div>

        {/* Additional help text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mã lỗi:{" "}
            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
              ERR_ACCESS_DENIED
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

const ServerError = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-red-950 dark:to-orange-950 flex items-center justify-center px-4">
      {/* Background decoration */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-400/20 to-red-600/20 rounded-full blur-3xl"></div>
      </div> */}

      <div className="relative z-10 max-w-md w-full">
        {/* Main card */}
        <div
          className={clsx(
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl",
            "border border-white/20 dark:border-gray-700/50 p-8 text-center",
            "transform hover:scale-[1.02] transition-all duration-300"
          )}
        >
          {/* Icon with animation */}
          <div className="mb-6 flex justify-center">
            <div
              className={clsx(
                "w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600",
                "flex items-center justify-center shadow-lg",
                "animate-bounce"
              )}
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          {/* Error code with gradient */}
          <div className="mb-4">
            <h1
              className={clsx(
                "text-8xl font-black bg-gradient-to-r from-red-500 via-orange-500 to-yellow-600",
                "bg-clip-text text-transparent drop-shadow-sm"
              )}
            >
              500
            </h1>
          </div>

          {/* Title */}
          <h2
            className={clsx(
              "text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100"
            )}
          >
            Lỗi Máy Chủ
          </h2>

          {/* Description */}
          <p
            className={clsx(
              "text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
            )}
          >
            Đã xảy ra lỗi không mong muốn trên máy chủ. Chúng tôi đang khắc phục
            sự cố này. Vui lòng thử lại sau.
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className={clsx(
                "group w-full inline-flex items-center justify-center gap-2 px-6 py-3",
                "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700",
                "text-white font-semibold rounded-xl shadow-lg hover:shadow-xl",
                "transform hover:-translate-y-0.5 transition-all duration-200",
                "focus:outline-none focus:ring-4 focus:ring-red-500/25"
              )}
            >
              <svg
                className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Thử Lại
            </button>

            <Link
              href="/"
              className={clsx(
                "group w-full inline-flex items-center justify-center gap-2 px-6 py-3",
                "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
                "text-gray-700 dark:text-gray-300 font-medium rounded-xl",
                "border border-gray-200 dark:border-gray-600",
                "transform hover:-translate-y-0.5 transition-all duration-200",
                "focus:outline-none focus:ring-4 focus:ring-gray-500/25"
              )}
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Về Trang Chủ
            </Link>

            <button
              onClick={() => window.history.back()}
              className={clsx(
                "group w-full inline-flex items-center justify-center gap-2 px-6 py-3",
                "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800",
                "text-gray-500 dark:text-gray-400 font-medium rounded-xl",
                "border border-dashed border-gray-300 dark:border-gray-600",
                "transform hover:-translate-y-0.5 transition-all duration-200",
                "focus:outline-none focus:ring-4 focus:ring-gray-500/25"
              )}
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay Lại
            </button>
          </div>
        </div>

        {/* Additional help text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Nếu sự cố tiếp tục xảy ra, vui lòng liên hệ hỗ trợ kỹ thuật
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mã lỗi:{" "}
            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
              ERR_INTERNAL_SERVER
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

const Authenticating = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decoration */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div> */}

      <div className="relative z-10 max-w-md w-full">
        {/* Main card */}
        <div
          className={clsx(
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl",
            "border border-white/20 dark:border-gray-700/50 p-8 text-center",
            "transform hover:scale-[1.02] transition-all duration-300"
          )}
        >
          {/* Loading spinner with icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Outer rotating ring */}
              <div
                className={clsx(
                  "w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700",
                  "border-t-blue-500 border-r-indigo-500 animate-spin"
                )}
              ></div>

              {/* Inner icon */}
              <div
                className={clsx(
                  "absolute inset-0 flex items-center justify-center",
                  "w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600",
                  "shadow-lg"
                )}
              >
                <svg
                  className="w-8 h-8 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title with gradient */}
          <h1
            className={clsx(
              "text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
              "bg-clip-text text-transparent"
            )}
          >
            Đang Xác Thực
          </h1>

          {/* Description */}
          <p
            className={clsx(
              "text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
            )}
          >
            Vui lòng chờ trong giây lát, chúng tôi đang xác minh thông tin đăng
            nhập của bạn.
          </p>

          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex justify-center space-x-2 mb-3">
              {[0, 1, 2].map((step, index) => (
                <div
                  key={step}
                  className={clsx(
                    "w-3 h-3 rounded-full transition-all duration-500",
                    index === 0 && "bg-blue-500 animate-bounce",
                    index === 1 &&
                      "bg-indigo-400 animate-bounce [animation-delay:0.1s]",
                    index === 2 &&
                      "bg-purple-400 animate-bounce [animation-delay:0.2s]"
                  )}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Xác thực tài khoản...
            </div>
          </div>

          {/* Security info */}
          <div
            className={clsx(
              "bg-blue-50 dark:bg-blue-950/50 rounded-xl p-4 mb-6",
              "border border-blue-200 dark:border-blue-800"
            )}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Kết nối an toàn
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Thông tin của bạn được mã hóa và bảo mật
            </p>
          </div>

          {/* Loading progress bar */}
          {/* <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div className={clsx(
              "bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full",
              "animate-pulse transition-all duration-1000",
              "w-3/4"
            )}></div>
          </div> */}

          {/* Tips */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              💡 <strong>Mẹo:</strong> Không đóng trang này trong quá trình xác
              thực
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Thời gian xác thực trung bình: 3-5 giây
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span>Hệ thống đang hoạt động bình thường</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RoleAccessProps {
  children: React.ReactNode;
  roles: DefaultAuthProvider["listRole"][];
  routeAuth?: boolean | false;
  customLoading?: React.ReactNode;
  customServerError?: React.ReactNode;
  customAccessDenied?: React.ReactNode;
}

function RoleAccess(props: RoleAccessProps) {
  const { children, roles } = props;
  const { userSession, pathLogin, pathLoginSuccess } = useAuthContext();
  const [isServerError, setIsServerError] = useState<boolean>(false);
  //console.log("authContext", authContext);

  const router = useRouter();

  const [isAccess, setIsAccess] = useState<{
    isLogin: boolean | null;
    isPermission: boolean | null;
  }>({
    isLogin: null,
    isPermission: null,
  });

  // console.log("isAccess", isAccess);
  // console.log("isServerError", isServerError);
  //console.log("userSession", userSession);
  //console.log("isServerError", isServerError);

  const getDataIsAccess = async () => {
    if (!userSession) {
      //chưa có session
      setIsAccess({
        isLogin: null,
        isPermission: null,
      });
      return setIsServerError(false);
    }
    if (userSession?.statusCode === 200 && userSession?.role === null) {
      setIsAccess({
        isLogin: null,
        isPermission: null,
      });
      return setIsServerError(false);
    }
    if (userSession?.statusCode === 200) {
      setIsServerError(false);
      if (userSession) {
        const role =
          userSession?.role?.toUpperCase() as DefaultAuthProvider["listRole"];
        if (roles.includes(role)) {
          //đã đăng nhập và có quyền
          return setIsAccess({
            isLogin: true,
            isPermission: true,
          });
        } else {
          //đã đăng nhập nhưng không có quyền
          return setIsAccess({
            isLogin: true,
            isPermission: false,
          });
        }
      }
    }
    if (userSession?.statusCode === 401) {
      setIsAccess({
        isLogin: false,
        isPermission: false,
      });
      return setIsServerError(false);
    }
    if (
      userSession?.statusCode &&
      userSession.statusCode >= 500 &&
      userSession.statusCode < 600
    ) {
      setIsAccess({
        isLogin: null,
        isPermission: null,
      });
      return setIsServerError(true);
    }
  };

  useEffect(() => {
    getDataIsAccess();
  }, [roles, userSession]);

  useEffect(() => {
    if (
      props?.routeAuth !== true &&
      isAccess.isLogin === false &&
      isAccess.isPermission === false
    ) {
      (async () => {
        router.push(pathLogin);
      })();
    }
  }, [isAccess]);

  useEffect(() => {
    if (props?.routeAuth === true && isAccess.isLogin === true) {
      router.push(pathLoginSuccess);
    }
  }, [isAccess]);

  const isAccessNull =
    isAccess.isLogin === null && isAccess.isPermission === null;

  const routeAccessDeniedConditions =
    isAccess.isLogin === true && isAccess.isPermission === false;

  const privateAccessConditions =
    isAccess.isPermission === true && isAccess.isLogin === true;

  const routeAuthConditions =
    isAccess.isLogin === false && isAccess.isPermission === false;

  //---------------------------------------------
  const roleAccessConditions = props.routeAuth
    ? routeAuthConditions
    : privateAccessConditions;

  //console.log("roleAccessConditions", roleAccessConditions);

  return (
    <>
      {roleAccessConditions && children}

      {!isServerError &&
        isAccessNull &&
        (props.customLoading ? props.customLoading : <Authenticating />)}

      {isServerError &&
        (props.customServerError ? props.customServerError : <ServerError />)}

      {routeAccessDeniedConditions &&
        (props.customAccessDenied ? (
          props.customAccessDenied
        ) : (
          <AccessDenied />
        ))}
    </>
  );
}

export default RoleAccess;
