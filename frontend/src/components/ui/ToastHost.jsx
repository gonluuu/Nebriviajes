import { useEffect, useState } from "react";

function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(event) {
      const toast = {
        id: Date.now() + Math.random(),
        message: event.detail?.message || "Aviso",
        type: event.detail?.type || "info",
      };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, 3500);
    }
    window.addEventListener("nebriviajes:toast", onToast);
    return () => window.removeEventListener("nebriviajes:toast", onToast);
  }, []);

  return (
    <div className="toast-host" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}>×</button>
        </div>
      ))}
    </div>
  );
}

export default ToastHost;
