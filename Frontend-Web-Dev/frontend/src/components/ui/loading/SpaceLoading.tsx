// import clsx from "clsx";

// export default function SpaceLoading() {
//   return (
//     <div 
//       className="fixed inset-0 flex items-center justify-center"
//       style={{ background: "radial-gradient(circle, rgba(22, 7, 60, 1) 11%, rgba(1, 9, 23, 1) 89%)" }}
//     >
//       <div className="relative">
//         {/* Orbital circles */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 animate-[spin_3s_linear_infinite]"></div>
//         </div>
        
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-40 h-40 rounded-full border-4 border-purple-400/20 animate-[spin_6s_linear_infinite]"></div>
//         </div>
        
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-56 h-56 rounded-full border-4 border-blue-300/10 animate-[spin_9s_linear_infinite_reverse]"></div>
//         </div>
        
//         {/* Central pulsing element */}
//         <div className="relative flex items-center justify-center">
//           <div className="w-16 h-16 bg-indigo-600 rounded-full animate-pulse shadow-lg shadow-indigo-500/50 flex items-center justify-center">
//             <div className="w-8 h-8 bg-violet-400 rounded-full animate-ping"></div>
//           </div>
//         </div>
        
//         {/* Floating particles */}
//         <div className="absolute top-4 left-8">
//           <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
//         </div>
//         <div className="absolute bottom-8 right-6">
//           <div className="w-3 h-3 bg-indigo-300 rounded-full animate-pulse"></div>
//         </div>
//         <div className="absolute top-16 right-12">
//           <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse"></div>
//         </div>
//         <div className="absolute bottom-16 left-20">
//           <div className="w-2 h-2 bg-purple-200 rounded-full animate-pulse"></div>
//         </div>
//       </div>
      
//       {/* Text */}
//       <div className="absolute mt-48">
//         <p className="text-purple-200 text-lg font-medium">
//           <span className="inline-block animate-pulse">Đang tải</span>
//           <span className="inline-block animate-bounce delay-75">.</span>
//           <span className="inline-block animate-bounce delay-100">.</span>
//           <span className="inline-block animate-bounce delay-150">.</span>
//         </p>
//       </div>
//     </div>
//   );
// }
import clsx from "clsx";

export default function SpaceLoading() {
  return (
    <div 
      className={clsx(
        "fixed inset-0 flex items-center justify-center",
        "bg-gradient-radial from-blue-100 via-purple-50 to-indigo-100",
        "dark:custom-bg-dark-container"
      )}
      // style={{ 
      //   background: 'var(--tw-gradient-stops, radial-gradient(circle, rgba(22, 7, 60, 1) 11%, rgba(1, 9, 23, 1) 89%))'
      // }}
    >
      {/* Dark mode gradient overlay */}
      {/* <div 
        className="absolute inset-0 dark:block hidden"
        style={{ background: "radial-gradient(circle, rgba(22, 7, 60, 1) 11%, rgba(1, 9, 23, 1) 89%)" }}
      ></div> */}
      
      <div className="relative z-10">
        {/* Orbital circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-400/60 dark:border-indigo-500/30 animate-[spin_3s_linear_infinite]"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-4 border-purple-300/40 dark:border-purple-400/20 animate-[spin_6s_linear_infinite]"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border-4 border-blue-200/30 dark:border-blue-300/10 animate-[spin_9s_linear_infinite_reverse]"></div>
        </div>
        
        {/* Central pulsing element */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 bg-indigo-500 dark:bg-indigo-600 rounded-full animate-pulse shadow-lg shadow-indigo-400/60 dark:shadow-indigo-500/50 flex items-center justify-center">
            <div className="w-8 h-8 bg-violet-500 dark:bg-violet-400 rounded-full animate-ping"></div>
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-4 left-8">
          <div className="w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-8 right-6">
          <div className="w-3 h-3 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-16 right-12">
          <div className="w-1 h-1 bg-blue-300 dark:bg-blue-200 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-16 left-20">
          <div className="w-2 h-2 bg-purple-300 dark:bg-purple-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Text */}
      <div className="absolute mt-48 z-10">
        <p className="text-purple-600 dark:text-purple-200 text-lg font-medium">
          <span className="inline-block animate-pulse">Đang tải</span>
          <span className="inline-block animate-bounce delay-75">.</span>
          <span className="inline-block animate-bounce delay-100">.</span>
          <span className="inline-block animate-bounce delay-150">.</span>
        </p>
      </div>
    </div>
  );
}