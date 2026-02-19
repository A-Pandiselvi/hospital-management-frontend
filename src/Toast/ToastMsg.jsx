
import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

let showToastFromOutside;
function ToastMsg(status = "success", message = "Success", options = {}) {
  if (showToastFromOutside) {
    showToastFromOutside({ status, message, ...options });
  } else {
    console.warn("Toast system not ready yet.");
  }
}
export default ToastMsg;

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    showToastFromOutside = setToast;
  }, []);

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{}}>
      {children}
      <Notification show={!!toast} data={toast} onClose={closeToast} />
    </ToastContext.Provider>
  );
};

const statusColors = {
  success: "fill-green-600",
  error:   "fill-red-600",
  info:    "fill-blue-600",
  warning: "fill-yellow-500",
};

const statusIcons = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] mr-3 fill-green-600" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="32" />
      <path
        className="fill-white"
        d="M26 39L16 29l4-4 6 6 16-16 4 4L26 39z"
      />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] mr-3 fill-red-600" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="32" />
      <line x1="20" y1="20" x2="44" y2="44" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      <line x1="44" y1="20" x2="20" y2="44" stroke="white" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] mr-3 fill-blue-600" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="32" />
      <line x1="32" y1="22" x2="32" y2="36" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="32" cy="44" r="4" fill="white"/>
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] mr-3 fill-yellow-500" viewBox="0 0 64 64">
      <polygon points="32,8 8,56 56,56" stroke="white" strokeWidth="6" fill="none"/>
      <line x1="32" y1="24" x2="32" y2="40" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="32" cy="48" r="4" fill="white"/>
    </svg>
  ),
};

const Notification = ({ show, data = {}, onClose }) => {
  const { message = "", status = "success", autoClose } = data || {};

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, autoClose ?? 3000);
    return () => clearTimeout(timer);
  }, [show, autoClose, onClose]);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999]">
      <AnimatePresence>
        {show && (
          <motion.div
            className="bg-white border border-slate-200 
                       shadow-[0_3px_10px_-3px_rgba(6,81,237,0.3)] 
                       text-slate-900 flex items-center 
                       max-w-sm px-4 py-3 rounded-xl"
            role="alert"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 400, duration: 0.5 }}
          >
            {/* dynamic icon based on status */}
            {statusIcons[status] || statusIcons.success}
            <span className="text-[15px] font-medium tracking-wide break-words">
              {message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};