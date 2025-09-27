import ListGroupChat from "@/modules/chat/components/chatGroups/ListGroupChat";
import { Splitter } from "antd";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Splitter style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <Splitter.Panel defaultSize="40%" min="20%" max="70%">
          <ListGroupChat />
        </Splitter.Panel>
        {children}
      </Splitter>
    </>
  );
}
