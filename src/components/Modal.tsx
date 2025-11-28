import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className = '' }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] w-full h-full overflow-auto bg-black/60 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-white my-[5%] mx-auto p-8 rounded-[20px] w-[90%] max-w-[800px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-slideDown ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="text-[#aaa] float-right text-[32px] font-bold leading-5 cursor-pointer transition-colors duration-300 hover:text-black"
          onClick={onClose}
        >
          &times;
        </span>
        <h2 className="text-[#2d3748] mb-5 border-b-[3px] border-[#3d944c] pb-2.5">{title}</h2>
        {children}
      </div>
    </div>
  );
};
