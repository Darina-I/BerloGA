import { useState, useEffect, useRef } from "react";
import { arrow } from "../../assets";

interface SelectProps {
  list: { id: number; name: string }[];
  label?: string;
  placeholder?: string;
  valueId?: number;
  onChange: (itemId: number) => void;
  className?: string;
}

const Select = ({
  list,
  label,
  onChange,
  valueId,
  placeholder,
  className,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      //проверка существует ли ref и НЕ находится ли кликнутый элемент внутри dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = (itemId: number) => {
    onChange(itemId);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div className={"flex flex-col"}>
        {label && <p className={"font-medium mb-1"}>{label}</p>}
        <div
          className={`bg-second-color rounded-lg px-3 py-2 flex 
          justify-between cursor-pointer ${className}`}
          onClick={toggleOpen}
        >
          <p>
            {valueId
              ? list.find((item) => item.id === valueId)?.name
              : placeholder}
          </p>
          <div className="flex">
            <img src={arrow} width={20} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute border border-second-color mt-0.5 rounded-lg space-y-1 w-full bg-white z-100">
          {list.map((item) => (
            <div
              key={item.id}
              className="hover:bg-main-color hover:text-white last:rounded-b-lg first:rounded-t-lg px-2 py-1 cursor-pointer"
              onClick={() => handleSelectItem(item.id)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
