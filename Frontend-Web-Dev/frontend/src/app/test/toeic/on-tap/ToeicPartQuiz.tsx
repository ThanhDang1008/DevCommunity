"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shuffle,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Menu,
  Check,
  X,
  Circle,
  ZoomIn,
  Eraser,
  ArchiveRestore,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { Image as ImageAntd, message } from "antd";

import type {
  Question,
  QuizData,
  QuizExplainData,
  ExplainQuestion,
} from "../MainToeic";

import { useMainToeicContext } from "../MainToeic";
import ScrollToTopButton from "@/components/ui/button/ScrollToTopButton";
import { BtnThemeToggle } from "@/components/layout/header/header";
import { NextAPI } from "@/shared/utils/next.api";
import { PartToeic } from "@/app/test/toeic/ToeicMenu";
import { convertMarkdownToHtml } from "@/shared/utils/markdownToHtml";
import { Modal } from "antd";

type ToeicPart3QuizProps = {};

type LazyLoadImageProps = {
  options: any;
  height: string;
  width: string;
  isLoading?: boolean;
};

const LazyLoadImage = (props: LazyLoadImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Chỉ quan sát một lần
        }
      },
      { threshold: 0.1 } // Khi 10% ảnh xuất hiện thì load
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (props.isLoading) {
    return (
      <div
        className={clsx(
          `flex justify-center items-center ${props.width} ${props.height} bg-gray-200 animate-pulse`
        )}
      >
        <i className="bi bi-image text-gray-400 text-4xl" />
      </div>
    );
  }

  return (
    <div ref={imgRef}>
      {isVisible ? (
        <>
          <ImageAntd {...props.options} />
        </>
      ) : (
        <div
          className={clsx(
            `flex justify-center items-center ${props.width} ${props.height} bg-gray-200 animate-pulse`
          )}
        >
          <i className="bi bi-image text-gray-400 text-4xl" />
        </div>
      )}
    </div>
  );
};

const MarkdownExplain = ({ markdown }: { markdown: string }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let isMounted = true;
    convertMarkdownToHtml(markdown).then((converted) => {
      if (isMounted) setHtml(converted);
    });

    return () => {
      isMounted = false;
    };
  }, [markdown]);

  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
};

const DOMAIN_FILE = "https://s3.cloudfly.vn";

const ToeicPartQuiz = (props: ToeicPart3QuizProps) => {
  const { selectedPart, selectedTest, countDownKey, setKey } =
    useMainToeicContext();
  // console.log("selectedPart", selectedPart);
  // console.log("selectedTest", selectedTest);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState<string>("");

  //const [dataPart, setDataPart] = useState<QuizData>({});
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  // console.log("dataPart", dataPart);
  const [questions, setQuestions] = useState<Question[]>([]);
  //console.log("___questions", questions);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [showProgressMenu, setShowProgressMenu] = useState<boolean>(false);
  const [isAllImagesVisible, setIsAllImagesVisible] = useState<boolean>(true);
  const [isReduceLoad, setIsReduceLoad] = useState<boolean | null>(null);
  // const [selectedImage, setSelectedImage] = useState<string | null>(null); // For image modal

  useEffect(() => {
    if (countDownKey > 0) {
      setIsModalOpen(false);
      setToken("");
    }
  }, [countDownKey]);

  useEffect(() => {
    // console.log("selectedPart", selectedPart);
    // console.log("selectedTest", selectedTest);
    if (!selectedPart || !selectedTest) {
      return;
    }
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        //https://file.minwandev.io.vn/file/toeic/part-03/part-03.json
        // const res = await fetch(
        //   `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedPart}.json`
        // );
        // const data = await res.json();
        const response = await NextAPI<QuizData>(
          `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedPart}.json`,
          {
            method: "GET",
          },
          {
            cache: "no-cache",
          }
        );
        // console.log("response", response);
        if (response.status === 200) {
          //setDataPart(response.data);
          //  console.log("response.data", response.data);
          // console.log("selectedTest", selectedTest);
          // console.log("selectedPart", selectedPart);

          if (!response?.data[selectedTest]) {
            console.warn(
              `No data found for part: ${selectedPart}, test: ${selectedTest}`
            );
            return;
          }
          const testData = response?.data[selectedTest] || [];
          if (testData.length === 0) {
            console.warn(
              `No questions found for part: ${selectedPart}, test: ${selectedTest}`
            );
            return;
          }
          //setDataPart({});
          setQuestions(testData);
          setOriginalQuestions(testData);
          setSelectedAnswers({});
          setShowAnswers({});
          setIsShuffled(false);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [selectedPart, selectedTest]);

  useEffect(() => {
    const fetchExplainData = async () => {
      try {
        const response = await NextAPI<QuizExplainData>(
          `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedPart}-explain.json`,
          {
            method: "GET",
          },
          {
            cache: "no-cache",
          }
        );
        // console.log("response", response);
        if (response.status === 200) {
          if (!response?.data[selectedTest]) {
            console.warn(
              `No data explain found for part: ${selectedPart}, test: ${selectedTest}`
            );
            return;
          }
          const testData = response?.data[selectedTest] || [];
          if (testData.length === 0) {
            console.warn(
              `No questions explain found for part: ${selectedPart}, test: ${selectedTest}`
            );
            return;
          }
          //thêm explain vào từng câu hỏi của questions
          const updatedQuestions = questions.map((question) => {
            const explanation =
              testData.find((item) => item.number === question.number)
                ?.explain || "(Không có giải thích)";
            return {
              ...question,
              explain: explanation,
            };
          });
          setQuestions(updatedQuestions);
        }
      } catch (error) {
        console.error("Error fetching explain data:", error);
      } finally {
      }
    };
    if (!selectedPart || !selectedTest) {
      return;
    }
    if (questions && questions.length > 0) {
      fetchExplainData();
    }
  }, [questions]);

  useEffect(() => {
    if (isReduceLoad) {
      let removedCount = 0;
      const filteredQuestions = originalQuestions.filter((question) => {
        // Loại bỏ câu hỏi nếu question.isReduceLoad === true
        if (question.isReduceLoad) {
          removedCount += 1;
          return false;
        }
        return true;
      });
      setQuestions(filteredQuestions);
      if (removedCount > 0) {
        message.open({
          type: "info",
          content: `Đã loại bỏ ${removedCount} câu hỏi giảm tải`,
          duration: 2,
        });
      }
    } else if (isReduceLoad === false) {
      // Nếu không còn loại bỏ câu hỏi giảm tải, khôi phục lại dữ liệu gốc
      setQuestions(originalQuestions);
      message.open({
        type: "info",
        content: "Đã khôi phục tất cả câu hỏi",
        duration: 2,
      });
    }
  }, [isReduceLoad]);

  // useEffect(() => {
  //   if (!dataPart[selectedTest]) {
  //     console.warn(
  //       `No data found for part: ${selectedPart}, test: ${selectedTest}`
  //     );
  //     return;
  //   }
  //   const testData = dataPart[selectedTest] || [];
  //   if (testData.length === 0) {
  //     console.warn(
  //       `No questions found for part: ${selectedPart}, test: ${selectedTest}`
  //     );
  //     return;
  //   }
  //   setDataPart({});
  //   setQuestions(testData);
  //   setOriginalQuestions(testData);
  //   setSelectedAnswers({});
  //   setShowAnswers({});
  //   setIsShuffled(false);
  // }, [dataPart, selectedTest]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleShuffle = () => {
    const shuffledQuestions = questions.map((question) => ({
      ...question,
      answer: shuffleArray(question.answer),
    }));
    setQuestions(shuffledQuestions);
    setIsShuffled(true);
    setSelectedAnswers({});
    setShowAnswers({});
  };

  const handleReset = () => {
    setQuestions(originalQuestions);
    setSelectedAnswers({});
    setShowAnswers({});
    setIsShuffled(false);
  };

  const handleAnswerSelect = (questionNumber: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: answerIndex,
    }));
  };

  const toggleShowAnswer = (questionNumber: number) => {
    setShowAnswers((prev) => ({
      ...prev,
      [questionNumber]: !prev[questionNumber],
    }));
  };

  // New function to show all answers
  const handleShowAllAnswers = () => {
    const allAnswersVisible: { [key: number]: boolean } = {};
    questions.forEach((question) => {
      allAnswersVisible[question.number] = true;
    });
    setShowAnswers(allAnswersVisible);
  };

  // New function to hide all answers
  const handleHideAllAnswers = () => {
    setShowAnswers({});
  };

  // Check if all answers are currently shown
  const allAnswersShown =
    questions.length > 0 &&
    questions.every((question) => showAnswers[question.number]);

  const getAnswerStatus = (question: Question, answerIndex: number) => {
    const selectedIndex = selectedAnswers[question.number];
    const isSelected = selectedIndex === answerIndex;
    const isCorrect = question.answer[answerIndex].isCorrect;
    const showAnswer = showAnswers[question.number];

    if (!showAnswer) {
      return {
        isSelected,
        isCorrect: false,
        isIncorrect: false,
        showResult: false,
      };
    }

    return {
      isSelected,
      isCorrect: isCorrect,
      isIncorrect: isSelected && !isCorrect,
      showResult: true,
    };
  };

  const calculateScore = () => {
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter((question) => {
      const selectedIndex = selectedAnswers[question.number];
      return (
        selectedIndex !== undefined && question.answer[selectedIndex].isCorrect
      );
    }).length;

    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage:
        totalQuestions > 0
          ? Math.round((correctAnswers / totalQuestions) * 100)
          : 0,
    };
  };

  const score = calculateScore();

  // Get question status for progress menu
  const getQuestionStatus = (questionNumber: number) => {
    const isAnswered = selectedAnswers[questionNumber] !== undefined;
    const isCorrect =
      isAnswered &&
      questions.find((q) => q.number === questionNumber)?.answer[
        selectedAnswers[questionNumber]
      ]?.isCorrect;
    const isShown = showAnswers[questionNumber];

    return { isAnswered, isCorrect, isShown };
  };

  const scrollToQuestion = (questionNumber: number) => {
    const element = document.getElementById(`question-${questionNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setShowProgressMenu(false);
  };

  // Image modal component
  // const ImageModal = ({
  //   src,
  //   onClose,
  // }: {
  //   src: string;
  //   onClose: () => void;
  // }) => (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
  //     <div className="relative max-w-4xl max-h-[90vh] p-4">
  //       <button
  //         onClick={onClose}
  //         className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors z-10"
  //       >
  //         <X className="w-5 h-5" />
  //       </button>
  //       <img
  //         src={src}
  //         alt="Question image"
  //         className="max-w-full max-h-full object-contain rounded-lg"
  //         onClick={onClose}
  //       />
  //     </div>
  //   </div>
  // );

  if (!selectedPart || !selectedTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="mb-4">
          <div className="flex justify-center items-center">
            <svg
              className="w-16 h-16 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dữ liệu đã hết hạn
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Vui lòng quay lại menu chọn lại phần luyện tập hoặc bài kiểm tra.
        </p>
        <Link
          href="/test/toeic"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại
        </Link>
      </div>
    );
  }

  if (isLoading === true) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center min-h-[40vh] p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  if (isLoading === false && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="mb-4">
          <div className="flex justify-center items-center">
            <svg
              className="w-16 h-16 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Không có dữ liệu cho phần này
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Hiện tại không có bài luyện tập nào cho phần này. Vui lòng chọn phần
          khác.
        </p>
        <Link
          href="/test/toeic"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại chọn phần khác
        </Link>
      </div>
    );
  }

  return (
    <>
      <div
        className={clsx(
          "w-full max-w-4xl mx-auto p-1 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg",
          {
            hidden: isLoading === null,
          }
        )}
      >
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/test/toeic"
            className={clsx(
              "mb-4 text-blue-600 p-2 inline-block dark:text-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/20",
              "hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            )}
          >
            <ChevronLeft className="inline-block mr-2" />
            Quay lại TOEIC
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                TOEIC
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Luyện tập câu hỏi trắc nghiệm
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Part: {selectedPart} - Test: {selectedTest}
              </p>
              {/* Countdown hiển thị thời gian còn lại của key */}
              {countDownKey > 0 ? (
                <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm font-medium">
                  Hết hạn sau:{" "}
                  <span>
                    {Math.floor(countDownKey / 3600)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {Math.floor((countDownKey % 3600) / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(countDownKey % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-sm font-medium">
                  Kích hoạt key
                  <button
                    className="ml-3 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors text-sm font-semibold"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Nhập key
                  </button>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-2 md:justify-end">
              <button
                onClick={(e) => {
                  if (countDownKey <= 0) {
                    e.preventDefault(); // Prevent default action if key is expired
                    setIsModalOpen(true);
                    return;
                  }
                  handleShuffle();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                Trộn đáp án
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Đặt lại
              </button>
              {/* Show/Hide All Answers Button */}
              <button
                onClick={(e) => {
                  if (countDownKey <= 0) {
                    e.preventDefault(); // Prevent default action if key is expired
                    setIsModalOpen(true);
                    return;
                  }
                  if (allAnswersShown) {
                    handleHideAllAnswers();
                  } else {
                    handleShowAllAnswers();
                  }
                }}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  allAnswersShown
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                )}
              >
                {allAnswersShown ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Ẩn tất cả
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Hiện tất cả
                  </>
                )}
              </button>
              {/* Show/Hide Picture Answers Button */}
              <button
                onClick={() => setIsAllImagesVisible(!isAllImagesVisible)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {isAllImagesVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {isAllImagesVisible ? "Ẩn hình ảnh" : "Hiện hình ảnh"}
              </button>
              {/* Reduce Load Button */}
              <button
                onClick={(e) => {
                  if (countDownKey <= 0) {
                    e.preventDefault(); // Prevent default action if key is expired
                    setIsModalOpen(true);
                    return;
                  }
                  setIsReduceLoad(!isReduceLoad);
                }}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  isReduceLoad
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                )}
              >
                {isReduceLoad === null ? (
                  <Eraser className="w-4 h-4" />
                ) : isReduceLoad ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ArchiveRestore className="w-4 h-4" />
                )}
                {isReduceLoad === null
                  ? "Loại bỏ câu giảm tải"
                  : isReduceLoad
                  ? "Đã loại bỏ câu giảm tải"
                  : "Đã khôi phục câu hỏi giảm tải"}
              </button>
              {/* Progress Menu Button */}
              <div>
                <button
                  onClick={(e) => {
                    if (countDownKey <= 0) {
                      e.preventDefault();
                      setIsModalOpen(true);
                      return;
                    }
                    setShowProgressMenu(!showProgressMenu);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {showProgressMenu ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                  Tiến độ
                </button>
              </div>
              <BtnThemeToggle />
            </div>
          </div>
          {/* Progress Menu Dropdown (pushes down, not absolute/relative) */}
          {showProgressMenu && (
            <div className="w-full max-w-[90vw] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 my-2">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Tiến độ làm bài ({Object.keys(selectedAnswers).length}/
                  {questions.length})
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {questions.map((question) => {
                  const status = getQuestionStatus(question.number);
                  return (
                    <div
                      key={question.number}
                      onClick={() => scrollToQuestion(question.number)}
                      className={clsx(
                        "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                        "hover:bg-gray-50 dark:hover:bg-gray-700",
                        status.isShown && "bg-blue-50 dark:bg-blue-900/20"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                        {question.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 dark:text-white truncate">
                          Câu {question.number}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {status.isAnswered ? (
                          status.isCorrect ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300" />
                        )}
                        {status.isShown && (
                          <Eye className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Score Display */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {score.correct}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Đúng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {score.total}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Tổng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {score.percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Điểm
                  </div>
                </div>
              </div>

              {isShuffled && (
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Shuffle className="w-4 h-4" />
                  <span className="text-sm font-medium">Đã trộn đáp án</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {questions &&
            questions.length > 0 &&
            questions.map((question, questionIndex) => {
              //console.log("question", `${questionIndex}: `, question.answer);
              if (!question.answer || question?.answer?.length === 0) {
                console.warn(
                  `Question ${question.number} has no answers defined`
                );
                return null; // Skip rendering this question if no answers
              }

              return (
                <div
                  key={`${question.number}-${questionIndex}`}
                  id={`question-${question.number}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-6 bg-gray-50 dark:bg-gray-800"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {question.number}. {question.question}
                      </h3>
                      {showAnswers[question.number] && (
                        <p className="text-gray-600 dark:text-gray-400 italic">
                          {question.translate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Question Images */}
                  {isAllImagesVisible &&
                    question?.images &&
                    question?.images?.length > 0 && (
                      <div className="mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {question.images.map((imageName, imageIndex) => {
                            // <div
                            //   key={imageIndex}
                            //   className="relative group cursor-pointer"
                            //   onClick={() => setSelectedImage(imageUrl)}
                            // >
                            //   <img
                            //     src={imageUrl}
                            //     alt={`Question ${question.number} - Image ${
                            //       imageIndex + 1
                            //     }`}
                            //     className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
                            //     onError={(e) => {
                            //       (e.target as HTMLImageElement).style.display =
                            //         "none";
                            //     }}
                            //   />
                            //   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                            //     <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            //   </div>
                            // </div>
                            const imageUrl =
                              selectedPart === PartToeic.PART_07
                                ? showAnswers[question.number]
                                  ? `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedTest}/ans-${imageName}`
                                  : `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedTest}/${imageName}`
                                : `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedTest}/${imageName}`;
                            // console.log("imageUrl", imageUrl);
                            return (
                              <LazyLoadImage
                                key={imageIndex}
                                options={{
                                  src: imageUrl,
                                  alt: `Question ${question.number} - Image ${
                                    imageIndex + 1
                                  }`,
                                  className:
                                    "w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 cursor-pointer",
                                  fallback: "/image/thumbnail_default.jpg",
                                }}
                                height="h-48"
                                width="w-full"
                              />
                              // <ImageAntd
                              //   key={imageIndex}
                              //   //src={`toeic/${selectedPart}/images/${selectedTest}/${imageName}`}
                              //   src={imageUrl}
                              //   alt={`Question ${question.number} - Image ${
                              //     imageIndex + 1
                              //   }`}
                              //   className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 cursor-pointer"
                              //   fallback={"/image/thumbnail_default.jpg"}
                              // />
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {question.answer.map((answer, answerIndex) => {
                      const status = getAnswerStatus(question, answerIndex);
                      const optionLabel = String.fromCharCode(65 + answerIndex);

                      return (
                        <div
                          key={answerIndex}
                          className={clsx(
                            "border rounded-lg p-4 cursor-pointer transition-all duration-200",
                            status.isSelected &&
                              !status.showResult &&
                              "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
                            status.isCorrect &&
                              status.showResult &&
                              "border-green-500 bg-green-50 dark:bg-green-900/20",
                            status.isIncorrect &&
                              status.showResult &&
                              "border-red-500 bg-red-50 dark:bg-red-900/20",
                            !status.isSelected &&
                              !status.showResult &&
                              "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-900"
                          )}
                          onClick={() =>
                            handleAnswerSelect(question.number, answerIndex)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className={clsx(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                                  status.isSelected &&
                                    !status.showResult &&
                                    "bg-blue-500 text-white",
                                  status.isCorrect &&
                                    status.showResult &&
                                    "bg-green-500 text-white",
                                  status.isIncorrect &&
                                    status.showResult &&
                                    "bg-red-500 text-white",
                                  !status.isSelected &&
                                    !status.showResult &&
                                    "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                )}
                              >
                                {optionLabel}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                  {(selectedPart !== PartToeic.PART_01 ||
                                    showAnswers[question.number]) &&
                                    answer.content}
                                  {status.showResult && status.isSelected && (
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-normal">
                                      (đã chọn)
                                    </span>
                                  )}
                                </div>
                                {status.showResult && (
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {answer.translate}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Result Icon */}
                            {status.showResult && (
                              <div className="ml-3">
                                {status.isCorrect ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : status.isIncorrect ? (
                                  <XCircle className="w-5 h-5 text-red-500" />
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Explanation Section */}
                  {question?.explain && showAnswers[question.number] && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        💡 Giải thích:
                      </h4>
                      {/* <p className="text-sm text-gray-700 dark:text-gray-300">
                      {question.explain}
                    </p> */}
                      <MarkdownExplain markdown={question.explain} />
                    </div>
                  )}
                  {/* Show Answer Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={(e) => {
                        if (countDownKey <= 0) {
                          e.preventDefault();
                          setIsModalOpen(true);
                          return;
                        }
                        toggleShowAnswer(question.number);
                      }}
                      className={clsx(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        showAnswers[question.number]
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      {showAnswers[question.number] ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Ẩn đáp án
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Hiện đáp án
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>
              Hoàn thành {Object.keys(selectedAnswers).length}/
              {questions.length} câu hỏi
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (Object.keys(selectedAnswers).length / questions.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Click outside to close progress menu */}
        {/* {showProgressMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProgressMenu(false)}
          />
        )} */}
      </div>
      {/* Modal nhập key để mở khoá */}
      <Modal
        open={isModalOpen}
        title="Nhập key để mở khoá"
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          if (token.trim() !== "") {
            setKey(token);
          } else {
            alert("Vui lòng nhập key để tiếp tục.");
          }
        }}
        okText="Xác thực"
        cancelText="Hủy"
        centered
        width={400}
        className="dark:bg-gray-900"
      >
        <div className="text-gray-700 dark:text-gray-300 italic">
          (nhập key để mở khoá các tính năng)
        </div>
        <input
          type="text"
          placeholder="Nhập key tại đây"
          className="mt-4 w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          onChange={(e) => {
            setToken(e.target.value);
          }}
          value={token}
        />
      </Modal>

      {/* Image Modal */}
      {/* {selectedImage && (
        <ImageModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )} */}
      <ScrollToTopButton />
    </>
  );
};

export default ToeicPartQuiz;
