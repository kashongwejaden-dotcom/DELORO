import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hoverEffect = false, ...props }) => {
    return (
        <motion.div
            className={`glass-panel ${className}`}
            whileHover={hoverEffect ? { y: -5, borderColor: 'rgba(212, 175, 55, 0.4)' } : {}}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
            <style>{`
                .glass-panel {
                    background: rgba(20, 20, 20, 0.6);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }
            `}</style>
        </motion.div>
    );
};

export default GlassCard;
