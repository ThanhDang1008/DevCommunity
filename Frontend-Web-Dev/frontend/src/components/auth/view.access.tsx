"use client";

import React, { useEffect, useState } from "react";

import type { DefaultAuthProvider } from "./auth.provider";
import { useAuthContext } from "./auth.provider";

interface RoleAccessProps {
  children: React.ReactNode;
  roles: DefaultAuthProvider["listRole"][];
  error?: React.ReactNode;
}

function ViewAccess(props: RoleAccessProps) {
  const { children, roles } = props;
  const { userSession } = useAuthContext();
  //console.log("authContext", authContext);

  const [isAccess, setIsAccess] = useState<{
    isLogin: boolean | null;
    isPermission: boolean | null;
  }>({
    isLogin: null,
    isPermission: null,
  });

  const getDataIsAccess = async () => {
    if (userSession) {
      const role =
        userSession?.role?.toUpperCase() as DefaultAuthProvider["listRole"];
      if (roles.includes(role)) {
        //đã đăng nhập và có quyền
        setIsAccess({
          isLogin: true,
          isPermission: true,
        });
      } else {
        //đã đăng nhập nhưng không có quyền
        setIsAccess({
          isLogin: true,
          isPermission: false,
        });
      }
    }
    if (!userSession) {
      //chưa có session
      setIsAccess({
        isLogin: false,
        isPermission: false,
      });
    }
  };
  //console.log("userSession", userSession);

  useEffect(() => {
    getDataIsAccess();
  }, [roles, userSession]);

  const isAccessNull =
    isAccess.isLogin === null && isAccess.isPermission === null;

  const routeAccessDeniedConditions =
    isAccess.isLogin === true && isAccess.isPermission === false;

  const routeAuthConditions =
    isAccess.isLogin === false && isAccess.isPermission === false;

  //---------------------------------------------

  //console.log("roleAccessConditions", roleAccessConditions);
  const privateAccessConditions =
    isAccess.isPermission === true && isAccess.isLogin === true;

  return (
    <>
      {privateAccessConditions ? children : props.error ? props.error : <></>}
    </>
  );
}

export default ViewAccess;
