"use client";

import { useState, useRef, useEffect, useContext, createContext } from "react";

import Conatainer from "@/components/layout/home/container";
import { message } from "antd";
import { EnumTokenPayloadKey, TokenStatus } from "@/app/test/toeic/VerifyToken";
import { PlayVideoYoutube } from "./PlayVideoYoutube";

export interface Answer {
  content: string;
  translate: string;
  isCorrect: boolean;
}

export interface Question {
  number: number;
  question: string;
  translate: string;
  answer: Answer[];
  images?: string[]; // Added images field
  explain?: string; // Added explanation field
  isReduceLoad?: boolean; // Added isReduceLoad field
}

export interface ExplainQuestion {
  number: number;
  explain: string;
}

export interface QuizData {
  [key: string]: Question[];
}

export interface QuizExplainData {
  [key: string]: ExplainQuestion[];
}

type TypeMainToeicContext = {
  selectedPart: string;
  setSelectedPart: (part: string) => void;
  selectedTest: string;
  setSelectedTest: (test: string) => void;
  key: string;
  setKey: (key: string) => void;
  countDownKey: number;
  setCountDownKey: (countDown: number) => void;
};

const MainToeicContext = createContext<TypeMainToeicContext>({
  selectedPart: "",
  setSelectedPart: () => {},
  selectedTest: "",
  setSelectedTest: () => {},
  key: "",
  setKey: () => {},
  countDownKey: 0,
  setCountDownKey: () => {},
});

type TypeMainToeicProps = {
  children: React.ReactNode;
};

const KEY_TOEIC = "toeic_key";

const MainToeic = (props: TypeMainToeicProps) => {
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [countDownKey, setCountDownKey] = useState<number>(0); //seconds

  //   console.log("selectedPart", selectedPart);
  //   console.log("selectedTest", selectedTest);

  type TypeTokenPayload = {
    // key: TOEIC
    key: string;
    //iat: 1784017255
    iat: string;
    // exp:1784017255
    exp: string;
  };

  //lưu key và lấy key từ localStorage
  useEffect(() => {
    const storedKey = localStorage.getItem(KEY_TOEIC);
    if (storedKey) {
      setKey(storedKey);
    }
  }, []);

  useEffect(() => {
    // console.log("key", key);

    const verify = async () => {
      fetch("/api/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
        },
      })
        .then((res) => res.json())
        .then(
          (data: { status: TokenStatus; payload: TypeTokenPayload | null }) => {
            // console.log("Token verify result:", data);
            if (
              data?.status === TokenStatus.TOKEN_VALID &&
              data?.payload?.key === EnumTokenPayloadKey.TOEIC
            ) {
              //tính thời gian đếm ngược

              // const expirationDate = new Date(data?.payload?.expiration);
              // const currentDate = new Date();
              // const timeDifference =
              //   expirationDate.getTime() - currentDate.getTime(); // đơn vị là milliseconds
              // const secondsDifference = Math.floor(timeDifference / 1000);
              // setCountDownKey(secondsDifference > 0 ? secondsDifference : 0);

              const currentTime = Math.floor(Date.now() / 1000); // thời gian hiện tại tính bằng giây
              const expirationTime = parseInt(data?.payload?.exp, 10); // thời gian hết hạn
              const secondsDifference = expirationTime - currentTime; // tính số giây còn lại
              setCountDownKey(secondsDifference > 0 ? secondsDifference : 0);
              localStorage.setItem(KEY_TOEIC, key);
              message.open({
                type: "success",
                content: "Xác thực thành công",
                duration: 2,
              });
            } else {
              setKey("");
              // alert(
              //   `Key không hợp lệ hoặc đã hết hạn. Details: ${data?.status}`
              // );
              localStorage.removeItem(KEY_TOEIC);
              message.open({
                type: "error",
                content: `Key không hợp lệ hoặc đã hết hạn. Details: ${data?.status}`,
                duration: 2,
              });
            }
          }
        )
        .catch((err) => {
          //alert(`Lỗi xác thực key`);
          localStorage.removeItem(KEY_TOEIC);
          message.open({
            type: "error",
            content: `Lỗi xác thực key`,
            duration: 2,
          });
        });
    };
    if (key) {
      verify();
    }
  }, [key]);

  useEffect(() => {
    if (countDownKey > 0) {
      const timer = setInterval(() => {
        setCountDownKey((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countDownKey]);

  return (
    <>
      <Conatainer>
        <MainToeicContext.Provider
          value={{
            selectedPart,
            setSelectedPart,
            selectedTest,
            setSelectedTest,
            key,
            setKey,
            countDownKey,
            setCountDownKey,
          }}
        >
          {props.children}
          <PlayVideoYoutube />
        </MainToeicContext.Provider>
      </Conatainer>
    </>
  );
};

export const useMainToeicContext = () => {
  const context = useContext(MainToeicContext);
  if (!context) {
    throw new Error(
      "useMainToeicContext must be used within a MainToeicProvider"
    );
  }
  return context;
};

export default MainToeic;
