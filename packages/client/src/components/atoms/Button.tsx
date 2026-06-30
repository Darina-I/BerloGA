interface ButtonProps {
  content: string;
  isIconButton?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({
  content,
  isIconButton = false,
  className,
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`p-2 bg-main-color rounded-lg cursor-pointer text-white ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {isIconButton ? <img src={content} /> : content}
    </button>
  );
};

export default Button;
