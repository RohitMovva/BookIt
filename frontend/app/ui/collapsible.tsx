import { useState, useRef, useEffect } from "react";

interface CollapsibleComponentProps {
  header?: string;
  text?: string;
}

export default function CollapsibleComponent({
  header = "Header",
  text = "Text",
}: CollapsibleComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState("0px");
  const [transitionClass, setTransitionClass] = useState("duration-0");
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(`${contentRef.current.scrollHeight}px`);
    }
    if (isOpen) {
      setTransitionClass("duration-200");
    } else {
      setTransitionClass("duration-0");
    }
  }, [isOpen]);

  return (
    <button
      onClick={toggleCollapse}
      className="w-full select-text transition-transform duration-300 hover:-translate-y-1"
    >
      <div
        className={`flex w-full items-center justify-between bg-blue-50 p-4 text-left transition-all ${transitionClass} ${
          isOpen ? "rounded-t" : "rounded"
        }`}
      >
        <h1 className="text-xl">{header}</h1>
        <span
          className={`transform select-none text-3xl font-extrabold leading-7 text-blue-800 transition-transform duration-200 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </div>
      <div
        ref={contentRef}
        className={`overflow-hidden rounded-b bg-gray-100 pr-4 transition-[height] duration-200`}
        style={{ height: isOpen ? contentHeight : "0px" }}
      >
        <div className="p-4">
          <p className="text-left text-gray-700">{text}</p>
        </div>
      </div>
    </button>
  );
}
