"use client";

import { useEffect } from "react";
import { useLayoutChatContext } from "@/modules/chat/components/LayoutChat";
import MainChat from "@/modules/chat/components/chatGroups/MainChat";
import { Splitter } from "antd";
import ListGroupChat from "@/modules/chat/components/chatGroups/ListGroupChat";
import { useMobile } from "@/hooks/useMobile.hook";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { setGroupId, groupId,groupIdRef } = useLayoutChatContext();
  const { isMobile } = useMobile({
    breakpoint: 768, // Breakpoint for mobile view
    checkUserAgent: false, // Check user agent for mobile devices
    checkTouch: false,
  });

  useEffect(() => {
    params.then((p) => {
      const { id } = p;
      setGroupId(id);
      groupIdRef.current = id; // Update the ref with the new groupId
    });
  }, [params]);

  return (
    <>
      <Splitter
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          flex: 1, //
          overflow: "hidden",
        }}
      >
        <Splitter.Panel
          defaultSize="40%"
          min="20%"
          max="70%"
          size={isMobile ? "0%" : "40%"}
          className="hidden md:block"
        >
          <ListGroupChat />
        </Splitter.Panel>

        {groupId && (
          <Splitter.Panel
            style={{
              maxHeight: "100vh",
              overflow: "auto",
            }}
          >
            <MainChat groupId={groupId} />
          </Splitter.Panel>
        )}
      </Splitter>
    </>
  );
}
