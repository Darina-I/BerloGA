import { useNavigate } from "react-router-dom";

interface LinkProps {
  link: string;
  content: string;
}

const Link = ({ link, content }: LinkProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
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
