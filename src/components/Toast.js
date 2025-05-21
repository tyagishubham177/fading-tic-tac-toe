// src/components/Toast.js
import React from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  const baseStyle = "p-4 rounded-md shadow-lg text-white flex justify-between items-center";
  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };
  return (
    <div className={`${baseStyle} ${typeStyles[type] || typeStyles.info}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <X size={20} />
      </button>
    </div>
  );
};
export default Toast;
