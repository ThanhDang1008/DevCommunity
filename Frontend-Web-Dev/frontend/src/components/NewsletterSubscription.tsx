"use client";

import { useState } from "react";
import clsx from "clsx";
import useClient from "@/hooks/useClient.hook";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isClient } = useClient();

  const handleSubmit = async () => {
    if (!email) return;

    setIsSubmitting(true);
    // Giả lập gọi API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setEmail("");
    alert("Đăng ký nhận tin thành công!");
  };

  return (
    <div
      className={clsx(
        "w-full max-w-2xl mx-auto p-8 rounded-3xl",
        "h-96 pb-14 sm:mb-0"
      )}
    >
      <div className="text-center space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <h2
            className={clsx(
              "text-4xl font-bold",
              "text-gray-800 dark:text-white"
            )}
          >
            Đăng ký nhận bản tin
          </h2>
          <p className={clsx("text-lg", "text-gray-600 dark:text-gray-300")}>
            Đăng ký nhận bản tin qua email để nhận những bài viết mới nhất, mẹo
            vặt và tài nguyên hữu ích từ chúng tôi.
          </p>
        </div>

        {/* Form */}
        {isClient && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className={clsx(
                  "flex-1 px-4 py-3 rounded-xl border",
                  "bg-white dark:bg-gray-800",
                  "border-gray-200 dark:border-gray-700",
                  "text-gray-900 dark:text-white",
                  "placeholder-gray-500 dark:placeholder-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent",
                  "transition-all duration-200",
                  "shadow-md shadow-violet-500/30"
                )}
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !email}
                className={clsx(
                  "px-6 py-3 rounded-xl font-semibold",
                  "bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400",
                  "text-white",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
                  "dark:focus:ring-offset-gray-800",
                  "disabled:cursor-not-allowed",
                  "shadow-md shadow-violet-500/30"
                )}
              >
                {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Text */}
        <p
          className={clsx(
            "text-sm flex items-center justify-center gap-1",
            "text-gray-600 dark:text-gray-400"
          )}
        >
          Cảm ơn bạn đã quan tâm đến bản tin của Devlogik!
          <span className="text-orange-500">✨</span>
        </p>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
