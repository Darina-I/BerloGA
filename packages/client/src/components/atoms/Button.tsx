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
      className={` ${!withoutBG && "py-2 px-3 bg-main-color rounded-lg"} cursor-pointer mx-2 ${className} text-white`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {isIconButton ? <img src={content} width={25} /> : content}
    </button>
  );
};

export default Button;
