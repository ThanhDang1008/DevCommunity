"use client";

import clsx from "clsx";

export const PageAdmin = ({ children }: { children: React.ReactNode }) => {
  //mb-16 mt-0 px-0 sm:mt-5 sm:mx-5 sm:mb-3
  return (
    <>
      <div
        className={clsx(
          "min-h-[90vh] pt-16 px-3 sm:px-7 pb-7 overflow-hidden",
          "bg-slate-50 dark:bg-zinc-900"
        )}
      >
        {children}
      </div>
    </>
  );
};
