interface ButtonProps {
  content: string;
  isIconButton: boolean;
}

const Button = ({ content, isIconButton = false }: ButtonProps) => {
  return (
    <button className="p-2 bg-main-color rounded-lg cursor-pointer">
      {isIconButton ? <img src={content} /> : content}
    </button>
  );
};

export default Button;
