"use client";

import { useEffect, useState, createContext, useContext, useRef } from "react";

import { socketPostService } from "@/service/socket/post/socketInstance";
import { PostEvent } from "@/service/socket/post/constants/Common";
import { eventSocket, KEY_MASTER } from "@/constants/Common";
import { useGetInfoUser } from "@/modules/user/hooks";
import { PostComments } from "./Comments";

type TypeLayoutPostCommentsContext = {
  isConnected: boolean | null;
  retryConnection: () => void;
  isReConnected: boolean;
};

const LayoutPostCommentsContext = createContext<TypeLayoutPostCommentsContext>({
  isConnected: false,
  retryConnection: () => {},
  isReConnected: false,
});

type LayoutPostCommentsProviderProps = {
  postId: string;
};

const LayoutPostComments = (props: LayoutPostCommentsProviderProps) => {
  const { data: userInfo } = useGetInfoUser();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isReConnected, setIsReConnected] = useState<boolean>(false);

  const retryConnection = () => {
    if (isConnected) return;
    setIsReConnected(true);
    handleConnection();
  };

  const handleConnection = () => {
    socketPostService.connect();
    socketPostService.socketConnectionEvents();

    socketPostService.on(eventSocket.CONNECT, () => {
      setIsConnected(true);
      setIsReConnected(false);
    });

    socketPostService.on(eventSocket.DISCONNECT, () => {
      setIsConnected(false);
      setIsReConnected(false);
    });

    socketPostService.on(eventSocket.CONNECT_ERROR, (error) => {
      setIsConnected(false);
      setIsReConnected(false);
      socketPostService.disconnect();
    });

    // socketChatService.emit(ChatEvent.JOIN_GROUP_CHAT, {
    //   groupId: groupId,
    //   userId: userInfo?._id,
    // });
    // socketChatService.emit(ChatEvent.CHAT_GROUP_JOIN_MULTIPLE, {
    //   listGroupId: listChatGroupId,
    //   userId: userInfo?._id,
    // });
  };

  useEffect(() => {
    if (!props.postId) return;

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
  }, [props.postId]);
  return (
    <LayoutPostCommentsContext.Provider
      value={{
        isConnected,
        retryConnection,
        isReConnected,
      }}
    >
      <PostComments
        postId={props.postId}
        isReConnected={isReConnected}
        retryConnection={retryConnection}
        isConnected={isConnected}
      />
    </LayoutPostCommentsContext.Provider>
  );
};

export const useLayoutPostCommentsContext = () => {
  const context = useContext(LayoutPostCommentsContext);
  if (!context) {
    throw new Error(
      "useLayoutPostCommentsContext must be used within a LayoutPostCommentsProvider"
    );
  }
  return context;
};

export default LayoutPostComments;
export { LayoutPostComments };
