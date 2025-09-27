"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Users,
  Image,
  MessageCircle,
  FileText,
  Headphones,
} from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

import { useMainToeicContext } from "./MainToeic";
import { BtnThemeToggle } from "@/components/layout/header/header";


interface Test {
  id: number;
  name: string;
  completed: boolean;
  value: string;
  score?: number;
}

interface Part {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  tests: Test[];
  value: string;
}

export enum PartToeic {
  PART_01 = "part-01",
  PART_02 = "part-02",
  PART_03 = "part-03",
  PART_04 = "part-04",
  PART_05 = "part-05",
  PART_06 = "part-06",
  PART_07 = "part-07",
}

const ToeicMenu: React.FC = () => {
  const router = useRouter();
  const [expandedParts, setExpandedParts] = useState<number[]>([]);
  const { setSelectedPart, setSelectedTest, setKey, countDownKey } =
    useMainToeicContext();
  const parts: Part[] = [
    {
      id: 1,
      name: "Part 1: Photographs",
      description: "Mô tả hình ảnh",
      icon: <Image className="w-5 h-5" />,
      value: PartToeic.PART_01,
      tests: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Test ${i + 1}`,
        value: `test-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
        completed: Math.random() > 0.7,
        score:
          Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 1 : undefined,
      })),
    },
    {
      id: 2,
      name: "Part 2: Question-Response",
      description: "Hỏi đáp",
      icon: <MessageCircle className="w-5 h-5" />,
      value: PartToeic.PART_02,
      tests: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Test ${i + 1}`,
        value: `test-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
        completed: Math.random() > 0.7,
        score:
          Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 1 : undefined,
      })),
    },
    {
      id: 3,
      name: "Part 3: Conversations",
      description: "Đối thoại",
      icon: <Users className="w-5 h-5" />,
      value: PartToeic.PART_03,
      tests: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Test ${i + 1}`,
        completed: Math.random() > 0.7,
        value: `test-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
        score:
          Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 1 : undefined,
      })),
    },
    {
      id: 4,
      name: "Part 4: Talks",
      description: "Bài nói chuyện",
      icon: <Headphones className="w-5 h-5" />,
      value: PartToeic.PART_04,
      tests: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Test ${i + 1}`,
        value: `test-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
        completed: Math.random() > 0.7,
        score:
          Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 1 : undefined,
      })),
    },
    {
      id: 5,
      name: "Part 5: Incomplete Sentences",
      description: "Hoàn thành câu",
      icon: <FileText className="w-5 h-5" />,
      value: PartToeic.PART_05,
      tests: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Test ${i + 1}`,
        value: `test-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
        completed: Math.random() > 0.7,
        score:
          Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 1 : undefined,
      })),
    },
    {
      id: 6,
      name: "Part 6: Text Completion",
      description: "Hoàn thành đoạn văn",
      icon: <BookOpen className="w-5 h-5" />,
      value: PartToeic.PART_06,
      tests: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Test ${i + 1}`,
        value: `test-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
        completed: Math.random() > 0.7,
        score:
          Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 1 : undefined,
      })),
    },
    {
      id: 7,
      name: "Part 7: Reading Comprehension",
      description: "Đọc hiểu",
      icon: <Clock className="w-5 h-5" />,
      value: PartToeic.PART_07,
      tests: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Test ${i + 1}`,
        value: `test-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
        completed: Math.random() > 0.7,
        score:
          Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 1 : undefined,
      })),
    },
  ];

  const togglePart = (partId: number) => {
    setExpandedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  const handleTestClick = (partId: number, testId: number) => {
    //console.log(`Selected Part ${partId}, Test ${testId}`);
    // Xử lý logic khi click vào test
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            TOEIC CTUET
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Chọn phần bạn muốn luyên tập hoặc kiểm tra. Mỗi phần sẽ có các bài
            test khác nhau để bạn có thể luyện tập kỹ năng.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <BtnThemeToggle />
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
              <></>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {parts.map((part) => {
            const isExpanded = expandedParts.includes(part.id);
            const completedTests = part.tests.filter(
              (test) => test.completed
            ).length;
            const progressPercentage =
              (completedTests / part.tests.length) * 100;

            return (
              <div
                key={part.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800"
              >
                {/* Part Header */}
                <div
                  className={clsx(
                    "p-4 cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                    isExpanded && "bg-blue-50 dark:bg-blue-900/20"
                  )}
                  onClick={() => togglePart(part.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600 dark:text-blue-400">
                        {part.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {part.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {part.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        {/* <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {completedTests}/10 hoàn thành
                      </div>
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div> */}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tests List */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <div className="p-4 bg-white dark:bg-gray-900">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {part.tests.map((test) => (
                          <button
                            key={test.id}
                            onClick={() => handleTestClick(part.id, test.id)}
                            className={clsx(
                              "p-3 rounded-lg border text-left transition-all duration-200 hover:shadow-md",
                              // test.completed
                              //   ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                              //   :
                              "border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600"
                            )}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {test.name}
                              </span>
                              {/* {test.completed && (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-2.5 h-2.5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )} */}
                            </div>
                            <button
                              type="button"
                              className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition w-full md:w-auto"
                              onClick={(e) => {
                                setSelectedPart(part.value);
                                setSelectedTest(test.value);
                                return router.push(
                                  `/test/toeic/on-tap?part=${part.value}&test=${test.value}`
                                );
                              }}
                            >
                              Luyện tập
                            </button>
                            <button
                              type="button"
                              className="mt-2 px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition w-full md:w-auto"
                              onClick={(e) => {
                                setSelectedPart(part.value);
                                setSelectedTest(test.value);
                                return router.push(
                                  `/test/toeic/kiem-tra?part=${part.value}&test=${test.value}`
                                );
                              }}
                            >
                              Kiểm tra
                            </button>
                            {/* {test.score && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Điểm: {test.score}%
                            </div>
                          )}
                          {!test.completed && (
                            <div className="text-sm text-gray-500 dark:text-gray-500">
                              Chưa hoàn thành
                            </div>
                          )} */}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall Progress */}
        {/* <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Tiến độ tổng thể
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {parts.reduce(
                (total, part) =>
                  total + part.tests.filter((test) => test.completed).length,
                0
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tests hoàn thành
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {parts.length * 10}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tổng số tests
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {
                parts.filter((part) =>
                  part.tests.every((test) => test.completed)
                ).length
              }
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Parts hoàn thành
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(
                (parts.reduce(
                  (total, part) =>
                    total + part.tests.filter((test) => test.completed).length,
                  0
                ) /
                  (parts.length * 10)) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tiến độ
            </div>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default ToeicMenu;
