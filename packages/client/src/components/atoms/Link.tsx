import { useNavigate } from "react-router-dom";

interface LinkProps {
  link: string;
  content: string;
  isOut?: boolean;
}

const Link = ({ link, content, isOut }: LinkProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isOut) {
      navigate(link);
    } else {
      window.open(link, "_blank");
    }
  };

  return (
    <a
      className="text-main-color underline underline-offset-3 cursor-pointer text-sm"
      onClick={handleClick}
    >
      {content}
    </a>
  );
};

export default Link;
