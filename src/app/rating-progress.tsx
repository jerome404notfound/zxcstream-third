interface CircularProgressProps {
  value: number;
  className?: string;
  strokeWidth?: number;
}

export default function CircularProgress({
  value,
  className = "w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 ",
  strokeWidth = 3,
}: CircularProgressProps) {
  const progress = (value / 10) * 100; // Convert to percentage (assuming max is 10)

  // Color based on rating
  const getColor = (rating: number) => {
    if (rating >= 7) return "#22c55e"; // green-500
    if (rating >= 5) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  return (
    <div className={`relative ${className}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Rating text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-[0.6rem] md:text-xs font-semibold drop-shadow-lg">
          {value?.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

// {
//   movie.vote_average > 0 && (
//     <div className="absolute top-0.5 right-0.5 ">
//       <div className="bg-black/50 rounded-full p-0.5 backdrop-blur-sm">
//         <CircularProgress
//           value={movie.vote_average}
//           className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10"
//         />
//       </div>
//     </div>
//   );
// }
