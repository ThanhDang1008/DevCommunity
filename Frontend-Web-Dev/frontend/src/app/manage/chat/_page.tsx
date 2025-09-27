"use client";

import { PageAdmin } from "../_components/page-admin";
import LayoutChat from "@/modules/chat/components/LayoutChat";
import MainChat from "@/modules/chat/components/chatGroups/MainChat";
import ListGroupChat from "@/modules/chat/components/chatGroups/ListGroupChat";
import { Flex, Splitter, Typography } from "antd";
import { useLayoutChatContext } from "@/modules/chat/components/LayoutChat";

export default function Page() {
  const { groupId } = useLayoutChatContext();
  return (
    <Splitter style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
      <Splitter.Panel defaultSize="40%" min="20%" max="70%">
        <ListGroupChat />
      </Splitter.Panel>
      {/* {groupId && (
        <Splitter.Panel>
          <MainChat />
        </Splitter.Panel>
      )} */}
    </Splitter>
  );
}
