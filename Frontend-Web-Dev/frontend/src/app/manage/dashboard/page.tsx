"use client";

import { useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { Tooltip as AntTooltip } from "antd";

import TreeSelectTag from "../_components/TreeSelectTag";
import TreeSelectContent from "../_components/TreeSelectContent";
import UpdateLogo from "../_components/UpdateLogo";
import UpdateFooter from "../_components/UpdateFooter";

export default function Page() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Introduction to React",
      category: "Tech",
      views: 1200,
      comments: 45,
    },
    {
      id: 2,
      title: "Healthy Recipes",
      category: "Lifestyle",
      views: 800,
      comments: 30,
    },
    {
      id: 3,
      title: "Travel Tips",
      category: "Travel",
      views: 1500,
      comments: 60,
    },
  ]);
  const pieData = [
    {
      name: "Tech",
      value: posts.filter((post) => post.category === "Tech").length,
    },
    {
      name: "Lifestyle",
      value: posts.filter((post) => post.category === "Lifestyle").length,
    },
    {
      name: "Travel",
      value: posts.filter((post) => post.category === "Travel").length,
    },
  ];

  const COLORS = ["#4bc0c0", "#9966ff", "#ff9f40"];

  const viewsByCategoryData = [
    {
      category: "Tech",
      views: posts
        .filter((post) => post.category === "Tech")
        .reduce((sum, post) => sum + post.views, 0),
    },
    {
      category: "Lifestyle",
      views: posts
        .filter((post) => post.category === "Lifestyle")
        .reduce((sum, post) => sum + post.views, 0),
    },
    {
      category: "Travel",
      views: posts
        .filter((post) => post.category === "Travel")
        .reduce((sum, post) => sum + post.views, 0),
    },
  ];
  return (
  
      <div>
        <div className="">
          <main className="max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Stat Card 1: Item Sales */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Tổng bài viết</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">7455</p>
            </div>
            <div className="flex items-center text-teal-500">
          <span className="text-sm">12%</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            ></path>
          </svg>
            </div>
          </div>

          {/* Stat Card 2: New Orders */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Tổng số chủ đề</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">9489</p>
            </div>
            <div className="flex items-center text-red-500">
          <span className="text-sm">6%</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
            </div>
          </div>

          {/* Stat Card 4: New Visitor */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Tổng lượt xem</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">5186</p>
            </div>
            <div className="flex items-center text-teal-500">
          <span className="text-sm">150%</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            ></path>
          </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Pie Chart: Percentage of Posts by Category */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Percentage of Posts by Category
            </h3>
            <div className="h-64 flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
              >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Views by Category */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Views by Category
            </h3>
            <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={viewsByCategoryData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="category" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#4bc0c0" />
            </BarChart>
          </ResponsiveContainer>
            </div>
          </div>
        </div>
          </main>
        </div>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="mt-3"></div>
        <div>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">Tuỳ chỉnh (header)</h1>
            <AntTooltip
              title="Sắp xếp nội dung hiển thị ở đầu trang (theo thứ tự)"
              placement="top"
            >
              <i className="bi bi-info-circle cursor-pointer hover:text-slate-500 mx-2"></i>
            </AntTooltip>
          </div>
          <TreeSelectTag />
        </div>
        <div className="mt-3"></div>
        <div>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">Tuỳ chỉnh (content)</h1>
            <AntTooltip
              title="Nội dung chủ đề hiển thị (hệ thống sẽ random ngẫu nhiên dựa trên danh sách đã chọn)"
              placement="top"
            >
              <i className="bi bi-info-circle cursor-pointer hover:text-slate-500 mx-2"></i>
            </AntTooltip>
          </div>
          <TreeSelectContent />
        </div>
        <div className="mt-3"></div>
        <div>
          <h1 className="text-lg font-semibold">Cập nhật (logo)</h1>
          <div className="mt-2"></div>
          <UpdateLogo />
        </div>
        <div className="mt-3"></div>
        <div>
          <h1 className="text-lg font-semibold">Cập nhật (footer)</h1>
          <div className="mt-2"></div>
          <UpdateFooter />
        </div>
      </div>
  
  );
}
