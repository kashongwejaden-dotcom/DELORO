import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`toast ${toast.type}`}
                        >
                            <div className="toast-icon">
                                {toast.type === 'success' && <CheckCircle size={20} />}
                                {toast.type === 'error' && <AlertCircle size={20} />}
                                {toast.type === 'info' && <Info size={20} />}
                            </div>
                            <span className="toast-message">{toast.message}</span>
                            <button onClick={() => removeToast(toast.id)} className="toast-close">
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <style>{`
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                }

                .toast {
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    background: #1a1a1a;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    min-width: 300px;
                    max-width: 400px;
                    backdrop-filter: blur(10px);
                }

                .toast.success { border-left: 4px solid #4ade80; }
                .toast.error { border-left: 4px solid #f87171; }
                .toast.info { border-left: 4px solid #60a5fa; }

                .toast-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .toast.success .toast-icon { color: #4ade80; }
                .toast.error .toast-icon { color: #f87171; }
                .toast.info .toast-icon { color: #60a5fa; }

                .toast-message {
                    flex: 1;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }

                .toast-close {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }

                .toast-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
            `}</style>
        </ToastContext.Provider>
    );
};
