"use client";

import {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  use,
} from "react";

import { socketChatService } from "@/service/socket/chat/socketInstance";
import { eventSocket } from "@/constants/Common";
import { ChatEvent } from "@/service/socket/chat/constants/Common";
import { useGetInfoUser } from "@/modules/user/hooks";

type TypeLayoutChatContext = {
  isConnected: boolean | null;
  groupId: string;
  setGroupId: (id: string) => void;
  setListChatGroupId: (listChatGroupId: string[]) => void;
  groupIdRef: React.MutableRefObject<string>;
  retryConnection: () => void;
  isReConnected: boolean;
};

const LayoutChatContext = createContext<TypeLayoutChatContext>({
  isConnected: false,
  groupId: "",
  setGroupId: () => {},
  setListChatGroupId: () => {},
  groupIdRef: { current: "" },
  retryConnection: () => {},
  isReConnected: false,
});

type LayoutChatProviderProps = {
  children: React.ReactNode;
};

const LayoutChat = (props: LayoutChatProviderProps) => {
  const { data: userInfo } = useGetInfoUser();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [groupId, setGroupId] = useState<string>("");
  const groupIdRef = useRef<string>(groupId);
  const [isReConnected, setIsReConnected] = useState<boolean>(false);
  //console.log("groupId", groupId);

  const [listChatGroupId, setListChatGroupId] = useState<string[]>([]);

  const retryConnection = () => {
    if (isConnected) return;
    setIsReConnected(true);
    handleConnection();
  };

  const handleConnection = () => {
    socketChatService.connect();
    socketChatService.socketConnectionEvents();

    socketChatService.on(eventSocket.CONNECT, () => {
      setIsConnected(true);
      setIsReConnected(false);
    });

    socketChatService.on(eventSocket.DISCONNECT, () => {
      setIsConnected(false);
      setIsReConnected(false);
    });

    socketChatService.on(eventSocket.CONNECT_ERROR, (error) => {
      setIsConnected(false);
      setIsReConnected(false);
      socketChatService.disconnect();
    });

    // socketChatService.emit(ChatEvent.JOIN_GROUP_CHAT, {
    //   groupId: groupId,
    //   userId: userInfo?._id,
    // });
    socketChatService.emit(ChatEvent.CHAT_GROUP_JOIN_MULTIPLE, {
      listGroupId: listChatGroupId,
      userId: userInfo?._id,
    });
  };

  useEffect(() => {
    if (!listChatGroupId || listChatGroupId.length === 0 || !userInfo) return;

    handleConnection();

    return () => {
      //   socketChatService.emit(ChatEvent.LEAVE_GROUP_CHAT, {
      //     groupId: groupId,
      //     userId: userInfo?._id,
      //   });
      //   socketChatService.emit(ChatEvent.CHAT_GROUP_LEAVE_MULTIPLE, {
      //     listGroupId: listChatGroupId,
      //     userId: userInfo?._id,
      //   });
      //   socketChatService.disconnect();
    };
  }, [listChatGroupId, userInfo]);


  return (
    <LayoutChatContext.Provider
      value={{
        isConnected,
        groupId,
        setGroupId,
        setListChatGroupId,
        groupIdRef,
        retryConnection,
        isReConnected,
      }}
    >
      {props.children}
    </LayoutChatContext.Provider>
  );
};

export const useLayoutChatContext = () => {
  const context = useContext(LayoutChatContext);
  if (!context) {
    throw new Error(
      "useLayoutChatContext must be used within a LayoutChatProvider"
    );
  }
  return context;
};

export default LayoutChat;
