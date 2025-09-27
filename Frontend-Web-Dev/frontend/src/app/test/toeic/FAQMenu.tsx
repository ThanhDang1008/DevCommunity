"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Info } from "lucide-react";
import clsx from "clsx";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "Thời gian bắt đầu ôn tập hiệu quả là khi nào?",
    answer:
      "Thời gian bắt đầu ôn tập hiệu quả là từ 1 tháng trước kỳ thi. Không có chuyện ôn gấp rút 1 tuần hay thậm chí vài ngày đối với tiếng Anh!!!",
  },
  {
    id: "2",
    question: "Làm thế nào để ôn tập hiệu quả?",
    answer:
      "Cách thức ôn tập nằm trong mỗi phần luyện tập. Bạn nên làm theo hướng dẫn và mẹo trong từng phần để đạt hiệu quả cao nhất.",
  },
  {
    id: "3",
    question: "Các phần trong TOEIC gồm những gì?",
    answer:
      "Các phần trong TOEIC bao gồm: 7 parts, mỗi part có những dạng câu hỏi khác nhau. Bạn có thể tham khảo chi tiết trong phần luyện tập.",
  },
  {
    id: "4",
    question: "Phần mềm có miễn phí không?",
    answer:
      "Không, bạn phải trả 49.000 VNĐ không giảm giá để sử dụng phần mềm này. Đây là mức giá hợp lý với những nỗ lực và thời gian đã bỏ ra để phát triển. Nếu bạn chia sẻ cho 5 người khác (không trùng & mail:@student.ctuet.edu.vn) bạn sẽ được miễn phí.",
  },
  //   {
  //     id: "5",
  //     question: "Cách tối ưu performance trong Next.js?",
  //     answer: "",
  //   },
  //   {
  //     id: "6",
  //     question: "Routing trong Next.js hoạt động như thế nào?",
  //     answer: "",
  //   },
];

export default function FAQMenu() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const toggleAll = () => {
    if (openItems.size === faqData.length) {
      setOpenItems(new Set());
    } else {
      setOpenItems(new Set(faqData.map((item) => item.id)));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            FAQ
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Đây là trang để ôn tập TOEIC nội bộ cho sinh viên Trường Đại học Kỹ
          thuật Công nghệ Cần Thơ (CTUET).
        </p>
      </div>

      {/* Introduction Section */}
      <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Lưu ý
            </h2>
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
              Đây là trang web sinh ra để ôn tập TOEIC vượt qua môn bằng những
              mẹo và thủ thuật. Không phù hợp với những ai muốn học hiểu bản
              chất vấn đề nên cân nhắc.
            </p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      {/* <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {faqData.length} câu hỏi
        </span>
        <button
          onClick={toggleAll}
          className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {openItems.size === faqData.length ? "Đóng tất cả" : "Mở tất cả"}
        </button>
      </div> */}

      {/* FAQ List */}
      {/* <div className="space-y-4">
        {faqData.map((item) => {
          const isOpen = openItems.has(item.id);

          return (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={clsx(
                  "w-full px-6 py-4 text-left flex items-center justify-between",
                  "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
                  isOpen ? "bg-gray-50 dark:bg-gray-700/30" : ""
                )}
              >
                <h3 className="font-medium text-gray-900 dark:text-white pr-4">
                  {item.question}
                </h3>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div> */}

      {/* Footer */}
      {/* <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Có thêm câu hỏi? Hãy liên hệ với chúng tôi để được hỗ trợ thêm.
        </p>
      </div> */}
    </div>
  );
}
