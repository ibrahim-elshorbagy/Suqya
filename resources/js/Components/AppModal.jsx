import React from 'react';

export default function AppModal({
  isOpen,
  onClose,
  title,
  icon,
  iconColor = "text-blue-500",
  children,
  size = "md",
  danger = false
}) {
  if (!isOpen) return null;

  // Determine width based on size
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    auto: ""
  };

  // Determine header styles based on danger prop
  const headerBorderClass = danger
    ? "border-red-200 dark:border-red-900/30"
    : "border-neutral-300 dark:border-neutral-700";

  const headerBgClass = danger
    ? "bg-red-50 dark:bg-red-950/10"
    : "bg-neutral-50 dark:bg-neutral-950/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-sm">
      <div
        className={`mx-3 my-4 transition-all duration-300 ease-in-out transform overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl sm:w-1/2 w-full ${sizeClasses[size]} animate-fadeIn border ${danger ? 'border-red-200 dark:border-red-900/30' : 'border-neutral-300 dark:border-neutral-700'}`}
        style={{ maxHeight: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between gap-2 p-4 border-b ${headerBorderClass} ${headerBgClass}`}>
          <div className="flex items-center gap-2">
            {icon && <i className={`fa-solid ${icon} ${iconColor} text-xl`}></i>}
            <h2 className="text-xl font-bold dark:text-neutral-100 text-neutral-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full py-1 px-2 text-neutral-600 hover:bg-neutral-300 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <i className="fa-solid fa-times"></i>
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-auto" style={{ flexGrow: 1, minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
