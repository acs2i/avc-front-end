import React from "react";

interface FormSectionProps {
  title: string;
  size?: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, size }) => {
  return (
    <div className="relative w-full flex flex-col gap-3">
      <h4 className="absolute top-[-12px] left-[20px] px-2 font-[900] text-[15px] text-gray-600 bg-slate-50">
        {title}
      </h4>
      <div className={`border border-slate-200 p-3 rounded-md ${size}`}>
        {children}
      </div>
    </div>
  );
};

export default FormSection;
