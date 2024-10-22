import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={`h-12 w-full rounded-xl border border-gray-400 px-4 py-2.5 focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default Textarea;
