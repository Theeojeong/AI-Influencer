import React, { useEffect, useState } from "react";

const Toast = ({ message, duration = 3000, onClose }) => {
  const [open, setOpen] = useState(Boolean(message));
  useEffect(() => {
    if (!message) return;
    setOpen(true);
    const t = setTimeout(() => {
      setOpen(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!open || !message) return null;
  return <div className="toast" role="status">{message}</div>;
};

export default Toast;

