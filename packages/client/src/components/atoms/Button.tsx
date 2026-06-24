interface ButtonProps {
  content: string;
  isIconButton?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = ({
  content,
  isIconButton = false,
  className,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      className={`p-2 bg-main-color rounded-lg cursor-pointer text-second-color ${className}`}
      type={type}
      disabled={disabled}
    >
      {isIconButton ? <img src={content} /> : content}
    </button>
  );
};

export default Button;
