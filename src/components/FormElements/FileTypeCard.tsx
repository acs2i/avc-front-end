import React from "react";

interface FieldTypeCardProps {
  label: string;
  onClick: () => void;
  selected: boolean;
}

const FieldTypeCard: React.FC<FieldTypeCardProps> = ({ label, onClick, selected }) => {
  return (
    <div
      className={`p-4 border rounded-md cursor-pointer ${
        selected ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onClick={onClick}
    >
      <p className={`text-center ${selected ? "text-blue-600" : "text-gray-800"}`}>{label}</p>
    </div>
  );
};

export default FieldTypeCard;
