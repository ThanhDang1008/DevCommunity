const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={`custom-bg-light-container dark:custom-bg-dark-container min-h-screen pt-7 px-2 md:px-12
    lg:px-16 xl:px-20 2xl:px-24 relative`}
    >
      {/* Decorative Elements - Only visible in light mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl bg-indigo-300"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl bg-pink-300"></div>
      </div>
      {children}
    </div>
  );
};

export default Container;
