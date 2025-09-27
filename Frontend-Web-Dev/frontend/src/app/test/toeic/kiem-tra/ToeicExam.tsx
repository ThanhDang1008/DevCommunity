"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Play,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Trophy,
  Medal,
  Star,
  Award,
  Download,
  Share,
  Target,
  Timer,
  BookOpen,
  TrendingUp,
  Camera,
  RotateCcw,
  AlertCircle,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  Shuffle,
  BookCheck,
  Eraser,
  ArchiveRestore,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Modal, Affix, message } from "antd";

import type { Question, QuizData, Answer } from "../MainToeic";

import ScrollToTopButton from "@/components/ui/button/ScrollToTopButton";
import { useMainToeicContext } from "../MainToeic";
import { NextAPI } from "@/shared/utils/next.api";
import { Image as ImageAntd } from "antd";
import { PartToeic } from "@/app/test/toeic/ToeicMenu";
import { BtnThemeToggle } from "@/components/layout/header/header";
import { ProgressMenu } from "@/app/test/toeic/ProgressMenu";

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
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
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
        <ImageAntd {...props.options} />
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

type ExamState = "waiting" | "started" | "finished" | "results";
const DOMAIN_FILE = "https://s3.cloudfly.vn";
const achievementPool = {
  APlus: [
    "Thật không thể tin được!",
    "Bạn là truyền nhân của Einstein à?",
    "Quá dữ, bạn hack não à?",
    "Phá đảo thế giới ảo!",
    "Thầy cô nên học lại từ bạn!",
    "Thành tích này chắc được lên báo!",
    "Bộ não bạn chạy bằng AI đúng không?",
    "Tôi nghi ngờ bạn đến từ hành tinh khác!",
    "Làm bài như đi dạo, quá đỉnh!",
    "Giỏi thế này thì thi làm gì nữa?",
  ],
  A: [
    "Rất tốt cứ phát huy!",
    "Gần đạt tới đỉnh cao rồi!",
    "Sắp lên level thần thánh!",
    "Bạn là nguồn cảm hứng cho đề thi!",
    "Không ai cản nổi bạn nữa!",
    "Lửa học tập cháy rừng rực!",
    "Nếu đây là game, bạn sắp lên boss!",
    "Thành tích đủ để khoe lên story!",
    "Thi lại? Không bao giờ là bạn!",
  ],
  B: [
    "Còn tí nữa thôi!",
    "Thiếu tí muối nhưng vẫn ngon!",
    "Trên trung bình là vui rồi!",
    "Vượt lên chính mình!",
    "Tay đã ấm, lần sau bốc đề là trúng lớn!",
    "Gọi đây là học lực 'ổn áp'!",
    "Đã không tệ, nhưng bạn còn làm được hơn thế!",
    "Hơi tiếc… mà thôi ăn mừng đi!",
    "Khá phết, không ai chê được!",
  ],
  C: [
    "Ôn lại nào không có gì phải vội vàng!",
    "Lần sau đừng ngủ quên nha!",
    "Chưa đỉnh nhưng có tiềm năng!",
    "Chơi thử mà đúng không?",
    "Về cơ bản là… không trượt!",
    "Bạn đã cố gắng… một chút!",
    "Gần dưới đáy nhưng vẫn còn thở!",
    "Chấm điểm xong muốn gọi bạn ra tâm sự!",
    "Trí nhớ cần bảo trì nhẹ!",
  ],
  F: [
    "Tại sao lại như thế này?",
    "Bạn đang troll tôi phải không?",
    "Trời không phụ người... học lại!",
    "Lên lớp nhờ năng lực đặc biệt?",
    "Không phải ai cũng có năng khiếu học lại!",
    "Đề khó? Hay bạn không học gì?",
    "Thầy cô nhìn bài bạn mà rơi nước mắt!",
    "Bạn đang thi thật hay đang thử hệ thống?",
    "Cười lên đi, buồn làm gì nữa!",
    "Kết quả này làm cả máy chấm bị sốc!",
  ],
};

const InfoPartsToeic = {
  [PartToeic.PART_01]: { name: "Photographs", duration: 3 },
  [PartToeic.PART_02]: { name: "Question-Response", duration: 8 },
  [PartToeic.PART_03]: { name: "Conversations", duration: 12 },
  [PartToeic.PART_04]: { name: "Talks", duration: 12 },
  [PartToeic.PART_05]: { name: "Incomplete Sentences", duration: 10 },
  [PartToeic.PART_06]: { name: "Text Completion", duration: 10 },
  [PartToeic.PART_07]: { name: "Reading Comprehension", duration: 55 },
};

const ToeicExam = () => {
  const { selectedPart, selectedTest, countDownKey, setKey } =
    useMainToeicContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState<string>("");

  const router = useRouter();
  const totalDurationPart =
    InfoPartsToeic[selectedPart as keyof typeof InfoPartsToeic]?.duration || 45;

  const namePart =
    InfoPartsToeic[selectedPart as keyof typeof InfoPartsToeic]?.name ||
    "Unknown Part";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [examState, setExamState] = useState<ExamState>("waiting");
  const [timeLeft, setTimeLeft] = useState(totalDurationPart * 60);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [examResults, setExamResults] = useState<any>(null);
  const [showResultDetails, setShowResultDetails] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isNameEntered, setIsNameEntered] = useState<boolean>(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<{
    [key: number]: Answer[];
  }>({});
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [isReduceLoad, setIsReduceLoad] = useState<boolean | null>(null);
  const [isAllImagesVisible, setIsAllImagesVisible] = useState<boolean>(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  const shuffleArray = (array: Answer[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleShuffleAllAnswers = () => {
    setShuffledAnswers((prev) => {
      const newShuffled: { [key: number]: Answer[] } = {};
      questions.forEach((question) => {
        newShuffled[question.number] = shuffleArray(question.answer);
      });
      return newShuffled;
    });
    // Reset selected answers to avoid confusion
    setSelectedAnswers({});
  };

  useEffect(() => {
    if (countDownKey > 0) {
      setIsModalOpen(false);
      setToken("");
    }
  }, [countDownKey]);

  useEffect(() => {
    if (!selectedPart || !selectedTest) {
      return;
    }
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        const response = await NextAPI<QuizData>(
          `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedPart}.json`
        );
        if (response.status === 200) {
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
          setQuestions(testData);
          const initialShuffled: { [key: number]: Answer[] } = {};
          testData.forEach((question) => {
            initialShuffled[question.number] = [...question.answer];
          });
          setShuffledAnswers(initialShuffled);
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
    if (isReduceLoad) {
      let removedCount = 0;
      const filteredQuestions = questions.filter((question) => {
        // Loại bỏ câu hỏi nếu question.isReduceLoad === true
        if (question.isReduceLoad) {
          removedCount += 1;
          return false;
        }
        return true;
      });
      setQuestions(filteredQuestions);
      setSelectedAnswers({});

      // Cập nhật shuffledAnswers để chỉ giữ lại câu hỏi không bị loại bỏ
      // setShuffledAnswers((prev) => {
      //   const newShuffled: { [key: number]: Answer[] } = {};
      //   filteredQuestions.forEach((question) => {
      //     newShuffled[question.number] = prev[question.number] || [];
      //   });
      //   return newShuffled;
      // });

      if (removedCount > 0) {
        message.open({
          type: "info",
          content: `Đã loại bỏ ${removedCount} câu hỏi giảm tải`,
          duration: 2,
        });
      }
    } else if (isReduceLoad === false) {
      // Nếu không còn loại bỏ câu hỏi giảm tải, khôi phục lại dữ liệu gốc
      setQuestions(questions);
      message.open({
        type: "info",
        content: "Đã khôi phục tất cả câu hỏi",
        duration: 2,
      });
    }
  }, [isReduceLoad]);

  useEffect(() => {
    if (examState === "started" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examState, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartExam = () => {
    if (!userName.trim()) {
      alert("Vui lòng nhập tên trước khi bắt đầu!");
      return;
    }
    setIsNameEntered(true);
    setExamState("started");
    setSelectedAnswers({});
    setShowAnswers({});
    setTimeLeft(totalDurationPart * 60);
  };

  const handleAnswerSelect = (questionNumber: number, answerIndex: number) => {
    if (examState === "started") {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionNumber]: answerIndex,
      }));
    }
  };

  const getRandomAchievement = (list: string[]) =>
    list[Math.floor(Math.random() * list.length)];

  const handleSubmitExam = () => {
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter((question) => {
      const selectedIndex = selectedAnswers[question.number];
      if (selectedIndex === undefined) return false;
      const originalIndex = question.answer.findIndex(
        (ans) =>
          ans.content ===
          shuffledAnswers[question.number][selectedIndex].content
      );
      return question.answer[originalIndex].isCorrect;
    }).length;

    const percentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
    const timeSpent = totalDurationPart * 60 - timeLeft;

    let grade = "F";
    let gradeColor = "text-red-500";
    let achievement = getRandomAchievement(achievementPool.F);
    let achievementIcon = AlertCircle;

    if (percentage >= 90) {
      grade = "A+";
      gradeColor = "text-green-500";
      achievement = getRandomAchievement(achievementPool.APlus);
      achievementIcon = Trophy;
    } else if (percentage >= 80) {
      grade = "A";
      gradeColor = "text-green-500";
      achievement = getRandomAchievement(achievementPool.A);
      achievementIcon = Medal;
    } else if (percentage >= 70) {
      grade = "B";
      gradeColor = "text-blue-500";
      achievement = getRandomAchievement(achievementPool.B);
      achievementIcon = Star;
    } else if (percentage >= 60) {
      grade = "C";
      gradeColor = "text-yellow-500";
      achievement = getRandomAchievement(achievementPool.C);
      achievementIcon = Award;
    }

    const results = {
      correct: correctAnswers,
      total: totalQuestions,
      percentage,
      grade,
      gradeColor,
      achievement,
      achievementIcon,
      timeSpent,
      answeredQuestions: Object.keys(selectedAnswers).length,
      userName,
    };

    setExamResults(results);
    setExamState("finished");
  };

  const handleViewResults = () => {
    setExamState("results");
    const allAnswersVisible: { [key: number]: boolean } = {};
    questions.forEach((question) => {
      allAnswersVisible[question.number] = true;
    });
    setShowAnswers(allAnswersVisible);
  };

  // Hàm để khôi phục lại trạng thái ban đầu của bài kiểm tra
  const handleRetakeExam = () => {
    setExamState("waiting");
    setSelectedAnswers({});
    setShowAnswers({});
    setExamResults(null);
    setTimeLeft(totalDurationPart * 60);
    setShowResultDetails(false);
    setUserName("");
    setIsNameEntered(false);
    const initialShuffled: { [key: number]: Answer[] } = {};
    questions.forEach((question) => {
      initialShuffled[question.number] = [...question.answer];
    });
    setShuffledAnswers(initialShuffled);
    setShowProgress(false);
  };

  const getAnswerStatus = (question: Question, answerIndex: number) => {
    const selectedIndex = selectedAnswers[question.number];
    const isSelected = selectedIndex === answerIndex;
    const originalIndex = question.answer.findIndex(
      (ans) =>
        ans.content === shuffledAnswers[question.number][answerIndex].content
    );
    const isCorrect = question.answer[originalIndex].isCorrect;
    const showAnswer = showAnswers[question.number];

    return {
      isSelected,
      isCorrect,
      isIncorrect: isSelected && !isCorrect,
      showResult: showAnswer,
    };
  };

  const captureResults = () => {
    if (resultsRef.current) {
      alert("Chức năng chụp màn hình đang được phát triển.");
    }
  };

  const shareResults = () => {
    if (navigator.share && examResults) {
      navigator.share({
        title: `Kết quả TOEIC của ${examResults.userName}`,
        text: `${examResults.userName} đã đạt ${examResults.percentage}% (${examResults.grade}) trong bài kiểm tra TOEIC! 🎉`,
        url: window.location.href,
      });
    } else {
      const text = `${examResults.userName} đã đạt ${examResults.percentage}% (${examResults.grade}) trong bài kiểm tra TOEIC! 🎉`;
      navigator.clipboard.writeText(text);
      alert("Đã sao chép kết quả vào clipboard!");
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Không có dữ liệu bài kiểm tra
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Hiện tại không có bài kiểm tra nào cho phần này. Vui lòng chọn phần
          khác.
        </p>
        <Link
          href="/test/toeic"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại TOEIC
        </Link>
      </div>
    );
  }

  if (examState === "waiting") {
    return (
      <div
        className={clsx("max-w-4xl mx-auto p-1 sm:p-6", {
          hidden: isLoading === null,
        })}
      >
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              TOEIC Practice Test {namePart}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Kiểm tra khả năng tiếng Anh của bạn trong {totalDurationPart} phút
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Part:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {selectedPart}
              </span>
              <br />
              Test:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {selectedTest}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Nhập tên của bạn"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <Timer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Thời gian
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {totalDurationPart} phút
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Câu hỏi
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {questions.length} câu
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Mục tiêu
              </h3>
              <p className="text-gray-600 dark:text-gray-300">≥ 80% để đạt</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <button
              onClick={handleStartExam}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <Play className="w-6 h-6" />
              Bắt đầu kiểm tra
            </button>
            <Link
              href="/test/toeic"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
              Quay lại TOEIC
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (examState === "finished" && examResults) {
    const AchievementIcon = examResults.achievementIcon;

    return (
      <>
        <div className="max-w-4xl mx-auto p-1 sm:p-6">
          <div
            ref={resultsRef}
            className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BookCheck className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🎉 Congratulations{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {examResults.userName}
                </span>{" "}
                on completing the test
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                You have completed the TOEIC test
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Part:{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {selectedPart}
                </span>
                <br />
                Test:{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {selectedTest}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="text-center">
                  <div
                    className={`text-6xl font-bold ${examResults.gradeColor} mb-2`}
                  >
                    {examResults.grade}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {examResults.percentage}%
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {examResults.achievement}
                  </div>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(examResults.percentage / 20)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Câu đúng
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {examResults.correct}/{examResults.total}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Thời gian
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatTime(examResults.timeSpent)}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-6 h-6 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Đã trả lời
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {examResults.answeredQuestions}/{examResults.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={captureResults}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold  shadow-lg"
              >
                <Camera className="w-5 h-5" />
                Chụp màn hình
              </button>

              <button
                onClick={shareResults}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold  shadow-lg"
              >
                <Share className="w-5 h-5" />
                Chia sẻ kết quả
              </button>

              <button
                onClick={(e) => {
                  if (countDownKey <= 0) {
                    e.preventDefault();
                    setIsModalOpen(true);
                    return;
                  }
                  handleViewResults();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold  shadow-lg"
              >
                <Eye className="w-5 h-5" />
                Xem kết quả
              </button>

              <button
                onClick={handleRetakeExam}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold  shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Làm lại
              </button>

              <Link
                href="/test/toeic"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold  shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
                Quay lại TOEIC
              </Link>
            </div>
          </div>
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
      </>
    );
  }

  return (
    <>
      <div className={clsx("max-w-4xl mx-auto p-1 sm:p-6")}>
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className={clsx(
              "mb-4 text-blue-600 p-2 inline-block dark:text-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/20",
              "hover:bg-blue-100 dark:hover:bg-blue-800 "
            )}
          >
            <ChevronLeft className="inline-block mr-2" />
            Quay lại
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="mb-6 sm:mb-0">
              {examState === "results" ? (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Toeic Test Results {namePart}
                </h1>
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  TOEIC Practice Test {namePart}
                </h1>
              )}
              {examState === "results" ? (
                <p className="text-gray-600 dark:text-gray-300 italic">
                  Xem lại câu trả lời và giải thích Part:{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {selectedPart}
                  </span>{" "}
                  Test:{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {selectedTest}
                  </span>
                </p>
              ) : (
                // `Part ${selectedPart} - Test ${selectedTest}`}
                <p className="text-gray-600 dark:text-gray-300">
                  Part:{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {selectedPart}
                  </span>{" "}
                  Test:{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {selectedTest}
                  </span>
                </p>
              )}
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
                    className="ml-3 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded  text-sm font-semibold"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Nhập key
                  </button>
                </div>
              )}
            </div>

            {examState === "started" && (
              <div className="flex flex-col md:flex-row flex-wrap items-stretch gap-4 w-full md:justify-end">
                <BtnThemeToggle />
                <button
                  onClick={(e) => {
                    if (countDownKey <= 0) {
                      e.preventDefault();
                      setIsModalOpen(true);
                      return;
                    }
                    handleShuffleAllAnswers();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg  w-full md:w-auto justify-center"
                >
                  <Shuffle className="w-5 h-5" />
                  Xáo trộn đáp án
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
                    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg ",
                    isReduceLoad === null
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : isReduceLoad
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
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
                {/* Show/Hide Picture Answers Button */}
                <button
                  onClick={() => setIsAllImagesVisible(!isAllImagesVisible)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                >
                  {isAllImagesVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {isAllImagesVisible ? "Ẩn hình ảnh" : "Hiện hình ảnh"}
                </button>
                <button
                  onClick={(e) => {
                    if (countDownKey <= 0) {
                      e.preventDefault();
                      setIsModalOpen(true);
                      return;
                    }
                    setShowProgress(!showProgress);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg  w-full md:w-auto justify-center"
                >
                  {showProgress ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                  {showProgress ? "Ẩn tiến độ" : "Hiển thị tiến độ"}
                </button>
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold  w-full md:w-auto"
                >
                  Nộp bài
                </button>
                <Affix offsetTop={10}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full md:w-auto justify-center shadow-lg bg-gradient-to-r ${
                      timeLeft < 300
                        ? "from-red-400 to-red-100 text-red-900"
                        : "from-blue-400 to-blue-100 text-blue-900"
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                    <span className="text-xl font-mono font-bold">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </Affix>
              </div>
            )}

            {examState === "results" && (
              <button
                onClick={handleRetakeExam}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg "
              >
                <ChevronLeft className="w-5 h-5" />
                Làm lại
              </button>
            )}
          </div>
          {/* Score Display */}
          {examState === "results" && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {
                        questions.filter((question) => {
                          const selectedIndex =
                            selectedAnswers[question.number];
                          if (selectedIndex === undefined) return false;
                          const originalIndex = question.answer.findIndex(
                            (ans) =>
                              ans.content ===
                              (shuffledAnswers[question.number]?.[selectedIndex]
                                ?.content ?? "")
                          );
                          return question.answer[originalIndex]?.isCorrect;
                        }).length
                      }
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Đúng
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {questions.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Tổng
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {questions.length > 0
                        ? Math.round(
                            (questions.filter((question) => {
                              const selectedIndex =
                                selectedAnswers[question.number];
                              if (selectedIndex === undefined) return false;
                              const originalIndex = question.answer.findIndex(
                                (ans) =>
                                  ans.content ===
                                  (shuffledAnswers[question.number]?.[
                                    selectedIndex
                                  ]?.content ?? "")
                              );
                              return question.answer[originalIndex]?.isCorrect;
                            }).length /
                              questions.length) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Điểm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showProgress && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Tiến độ làm bài
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {questions.map((question) => (
                  <div
                    key={question.number}
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      selectedAnswers[question.number] !== undefined
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {question.number}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question, questionIndex) => (
            <div
              id={`question-${question.number}`}
              key={question.number}
              className="bg-white dark:bg-gray-800 rounded-lg px-3 py-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {question.number}. {question.question}
                </h3>
                {examState === "results" && (
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    {question.translate}
                  </p>
                )}
              </div>

              {isAllImagesVisible &&
                question?.images &&
                question?.images?.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {question.images.map((imageName, imageIndex) => {
                        const imageUrl =
                          selectedPart === PartToeic.PART_07
                            ? showAnswers[question.number]
                              ? `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedTest}/ans-${imageName}`
                              : `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedTest}/${imageName}`
                            : `${DOMAIN_FILE}/file/toeic/${selectedPart}/${selectedTest}/${imageName}`;
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
                        );
                      })}
                    </div>
                  </div>
                )}

              <div className="space-y-3 mb-6">
                {(shuffledAnswers[question.number] || question.answer).map(
                  (answer, answerIndex) => {
                    const status = getAnswerStatus(question, answerIndex);
                    const optionLabel = String.fromCharCode(65 + answerIndex);
                    const isDisabled = examState === "results";

                    return (
                      <div
                        key={answerIndex}
                        className={`border rounded-lg p-4 transition-all duration-200 ${
                          isDisabled ? "cursor-default" : "cursor-pointer"
                        } ${
                          status.isSelected && !status.showResult
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : status.isCorrect && status.showResult
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : status.isIncorrect && status.showResult
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                        onClick={() =>
                          !isDisabled &&
                          handleAnswerSelect(question.number, answerIndex)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                status.isSelected && !status.showResult
                                  ? "bg-blue-500 text-white"
                                  : status.isCorrect && status.showResult
                                  ? "bg-green-500 text-white"
                                  : status.isIncorrect && status.showResult
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {optionLabel}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {(selectedPart !== PartToeic.PART_01 ||
                                  showAnswers[question.number]) &&
                                  answer.content}
                                {status.showResult && status.isSelected && (
                                  <span className="text-xs text-blue-600 dark:text-blue-400 font-normal ml-2">
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
                  }
                )}
              </div>

              {examState === "results" && question?.explain && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    💡 Giải thích:
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {question?.explain}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        {examState === "started" && (
          <div className="flex flex-col justify-center my-8 gap-3">
            <div className="text-center text-gray-600 dark:text-gray-400">
              Hoàn thành {Object.keys(selectedAnswers).length}/
              {questions.length} câu hỏi
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-4">
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
            <button
              onClick={handleSubmitExam}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-semibold shadow-lg"
            >
              Nộp bài
            </button>
          </div>
        )}
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
      <ProgressMenu questions={questions} selectedAnswers={selectedAnswers} />
      <ScrollToTopButton />
    </>
  );
};

export default ToeicExam;
