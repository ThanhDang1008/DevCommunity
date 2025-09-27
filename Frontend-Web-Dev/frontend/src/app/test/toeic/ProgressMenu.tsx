"use client";

import { useState, useEffect } from "react";
import { ListChecks, Check, X, Circle, Eye } from "lucide-react";
import clsx from "clsx";

import type { Question } from "./MainToeic";

type TypeProgressMenuProps = {
  questions: Question[];
  selectedAnswers: {
    [key: number]: number;
  };
};

const ProgressMenu = (props: TypeProgressMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );

  // Xử lý hiển thị nút khi người dùng cuộn xuống đủ xa và xác định hướng cuộn
  useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hiển thị nút khi cuộn xuống đủ xa
      if (currentScrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Handle scroll direction
      const scrollDiff = currentScrollY - lastScrollY;
      if (Math.abs(scrollDiff) > 100) {
        if (scrollDiff > 0) {
          setScrollDirection("down");
        } else {
          setScrollDirection("up");
        }
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý event khi click vào nút
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  //   <div className="max-h-64 overflow-y-auto p-2">
  //                       {questions.map((question) => {
  //                         const status = getQuestionStatus(question.number);
  //                         return (
  //                           <div
  //                             key={question.number}
  //                             onClick={() => scrollToQuestion(question.number)}
  //                             className={clsx(
  //                               "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
  //                               "hover:bg-gray-50 dark:hover:bg-gray-700",
  //                               status.isShown && "bg-blue-50 dark:bg-blue-900/20"
  //                             )}
  //                           >
  //                             <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
  //                               {question.number}
  //                             </div>
  //                             <div className="flex-1 min-w-0">
  //                               <div className="text-sm text-gray-900 dark:text-white truncate">
  //                                 Câu {question.number}
  //                               </div>
  //                             </div>
  //                             <div className="flex items-center gap-1">
  //                               {status.isAnswered ? (
  //                                 status.isCorrect ? (
  //                                   <Check className="w-4 h-4 text-green-500" />
  //                                 ) : (
  //                                   <X className="w-4 h-4 text-red-500" />
  //                                 )
  //                               ) : (
  //                                 <Circle className="w-4 h-4 text-gray-300" />
  //                               )}
  //                               {status.isShown && (
  //                                 <Eye className="w-4 h-4 text-blue-500" />
  //                               )}
  //                             </div>
  //                           </div>
  //                         );
  //                       })}
  //                     </div>

  // Get question status for progress menu
  const getQuestionStatus = (questionNumber: number) => {
    const isAnswered = props.selectedAnswers[questionNumber] !== undefined; // Kiểm tra xem câu hỏi đã được trả lời hay chưa
    const isCorrect =
      isAnswered &&
      props.questions.find((q) => q.number === questionNumber)?.answer[
        props.selectedAnswers[questionNumber]
      ]?.isCorrect; // Kiểm tra xem câu trả lời có đúng hay không

    return { isAnswered, isCorrect };
  };

  const scrollToQuestion = (questionNumber: number) => {
    const element = document.getElementById(`question-${questionNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  //console.log("ProgressMenu props:", props);

  return (
    <>
      {isVisible && (
        <>
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className={clsx(
              "fixed p-3 rounded-full bg-purple-700 bg-opacity-80 hover:bg-purple-600 shadow-lg shadow-purple-900/50 backdrop-blur-sm text-white transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 group z-40",
              "right-6 bottom-32",
              {
                "opacity-20": scrollDirection === "down",
              }
            )}
          >
            <ListChecks
              size={18}
              className={clsx("group-hover:animate-bounce")}
            />
          </button>
          {isOpen && (
            <div
              className={clsx(
                "fixed right-20 bottom-96 w-64 bg-gradient-to-br from-blue-500 via-cyan-600 to-teal-700 shadow-xl rounded-xl p-3 z-50",
                "transition-transform transform translate-y-full"
                // scrollDirection === "up" ? "translate-y-0" : "translate-y-full"
              )}
            >
              <h3 className="text-lg font-semibold mb-2 text-white drop-shadow">
                Danh sách câu hỏi
              </h3>
              <div className="mb-2 text-white text-sm font-medium">
                Đã trả lời: {Object.keys(props.selectedAnswers).length} /{" "}
                {props.questions.length}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {props.questions.map((question) => {
                  const status = getQuestionStatus(question.number);
                  return (
                    <div
                      key={question.number}
                      onClick={() => scrollToQuestion(question.number)}
                      className="p-2 border-b border-white/20 hover:bg-white/20 rounded-lg cursor-pointer transition-colors flex flex-row items-center sm:items-stretch gap-2 sm:gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium shrink-0">
                        {question.number}
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="text-sm text-white truncate">
                          {question.question}
                        </div>
                      </div>
                      <div
                        className={clsx(
                          "flex items-center gap-1 mt-2 sm:mt-0 px-1 py-1 rounded",
                          {
                            "bg-green-100 dark:bg-green-900/30":
                              status.isAnswered,
                          }
                        )}
                      >
                        {status.isAnswered ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProgressMenu;
export { ProgressMenu };
