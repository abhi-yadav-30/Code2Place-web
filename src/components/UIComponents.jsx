import { useState } from "react";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Accordion({ items, openIndex, setOpenIndex }) {
  return (
    <div className="w-full space-y-3">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}

export function AccordionItem({ title, children, isOpen, onClick }) {
  return (
    <div className={`overflow-hidden rounded-2xl transition-all duration-300 ${isOpen ? 'glass border-orange-500/30' : 'bg-white/5 border border-white/5 hover:bg-white/10'}`}>
      <button
        className="w-full flex justify-between items-center px-6 py-4 text-left transition-colors"
        onClick={onClick}
      >
        <span className={`text-lg font-semibold ${isOpen ? 'text-orange-500' : 'text-gray-200'}`}>{title}</span>
        {isOpen ? <ChevronUp className="text-orange-500" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Button({ children, onClick, className = "", variant = "primary", disabled = false }) {
  const baseStyles = "px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    outline: "bg-transparent border border-orange-500/50 text-orange-500 hover:bg-orange-500/10",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`glass-card rounded-3xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-8 ${className}`}>{children}</div>;
}
