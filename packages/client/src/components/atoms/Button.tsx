interface ButtonProps {
  content: string;
  isIconButton?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  withoutBG?: boolean;
}

const Button = ({
  content,
  isIconButton = false,
  className,
  type = "button",
  disabled = false,
  onClick,
  withoutBG = false,
}: ButtonProps) => {
  return (
    <button
      className={` ${!withoutBG && "p-2 bg-main-color rounded-lg"}  cursor-pointer  ${className} text-white`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {isIconButton ? <img src={content} width={25} /> : content}
    </button>
  );
};

export default Button;
