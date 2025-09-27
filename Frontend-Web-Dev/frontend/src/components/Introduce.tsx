import clsx from "clsx";

const Introduce = () => {
  return (
    <div className="min-h-screen transition-all duration-500 ease-in-out">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Decorative Elements */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl bg-indigo-300 dark:bg-purple-500"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl bg-pink-300 dark:bg-blue-500"></div>
        </div> */}

        {/* Header Content */}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight bg-gradient-to-br from-gray-900 via-purple-700 to-indigo-800 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent transition-all duration-500">
            Dev
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              logik
            </span>
          </h1>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 text-gray-700 dark:text-gray-300 transition-colors duration-500">
            Nơi chia sẻ kiến thức và kinh nghiệm lập trình
          </h2>

          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 text-gray-600 dark:text-gray-400 transition-colors duration-500">
            Chào mừng bạn đến với Devlogik, nơi chúng tôi chia sẻ những kiến
            thức, kinh nghiệm và tài nguyên hữu ích trong lĩnh vực lập trình. Từ
            các bài viết hướng dẫn, mẹo vặt đến các dự án mã nguồn mở, chúng tôi
            hy vọng sẽ giúp bạn nâng cao kỹ năng và đam mê lập trình của mình.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-glass glass px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-gray-800 hover:bg-gray-800/5 dark:border-white/30 dark:text-white dark:hover:bg-white/10 backdrop-blur-sm">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Tham gia cộng đồng
              </span>
            </button>

            <button className="btn-glass glass px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-gray-800 hover:bg-gray-800/5 dark:border-white/30 dark:text-white dark:hover:bg-white/10 backdrop-blur-sm">
              <span className="bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
                Giới thiệu
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
