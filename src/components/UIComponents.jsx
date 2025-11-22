import { useState } from "react";


export function Accordion({ items, openIndex, setOpenIndex }) {
  return (
    <div className="w-full space-y-2">
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
    <div className="border border-gray-600 rounded-lg">
      <button
        className="w-full flex justify-between items-center px-4 py-3 bg-[#333] text-white text-lg"
        onClick={onClick}
      >
        {title}
        <span>{isOpen ? "-" : "+"}</span>
      </button>

      {isOpen && <div className="p-3 bg-[#2d2d2d] text-white">{children}</div>}
    </div>
  );
}
export function Button({ children, onClick, className = "", asChild = false }) {
  if (asChild) return children;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white ${className} cursor-pointer`}
    >
      {children}
    </button>
  );
}

export function Card({ children }) {
  return <div className="bg-[#333] rounded-2xl shadow-lg">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
