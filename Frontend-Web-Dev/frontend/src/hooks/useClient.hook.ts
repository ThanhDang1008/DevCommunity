"use client";

import { useState, useEffect } from "react";

const useClient = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [isServer, setIsServer] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsMounted(true);
    setIsBrowser(typeof window !== "undefined");
    setIsServer(typeof window === "undefined");
  }, []);

  return {
    isClient,
    isMounted,
    isBrowser,
    isServer,
  };
};

export default useClient;
